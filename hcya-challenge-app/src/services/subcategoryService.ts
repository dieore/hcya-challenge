import api from "../config/api";

export interface Subcategory {
  id: string;
  name: string;
  categoryId: number;
}

export interface SubcategoryQueryParams {
  _sort?: string;
  _order?: "asc" | "desc";
  _page?: number;
  _limit?: number;
  name_like?: string;
  categoryId?: string[];
}

export const initialSubcategoryFilters: SubcategoryQueryParams = {
  _sort: "name",
  _order: "asc",
  _page: 1,
  _limit: 10,
};

export class SubcategoryService {
  private endpoint: string = "/subcategories";
  private api = api;

  async getAll(): Promise<Subcategory[]> {
    const res = await this.api.get(this.endpoint);
    return res.data;
  }

  async getById(id: string): Promise<Subcategory> {
    const res = await this.api.get(`${this.endpoint}/${id}`);
    return res.data;
  }

  async getByQuery(params: SubcategoryQueryParams = {}) {
    const searchParams = new URLSearchParams();
    searchParams.append('_expand', 'category');

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) => {
          searchParams.append(key, val.toString());
        });
      } else if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const url = `${this.endpoint}?${searchParams.toString()}`;
    const response = await this.api.get(url);
    return response.data;
  }

  async create(Subcategory: Omit<Subcategory, "id">): Promise<Subcategory> {
    const res = await this.api.post(this.endpoint, Subcategory);
    return res.data;
  }

  async update(
    id: string,
    Subcategory: Partial<Subcategory>
  ): Promise<Subcategory> {
    const res = await this.api.put(`${this.endpoint}/${id}`, Subcategory);
    return res.data;
  }

  async delete(id: string): Promise<void> {
    await this.api.delete(`${this.endpoint}/${id}`);
  }
}
