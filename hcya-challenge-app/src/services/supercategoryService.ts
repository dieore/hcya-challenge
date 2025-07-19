import api from "../config/api";

export interface Supercategory {
  id: string;
  name: string;
}

export interface SupercategoryQueryParams {
  _sort?: string;
  _order?: "asc" | "desc";
  _page?: number;
  _limit?: number;
  name_like?: string;
}

export const initialSupercategoryFilters: SupercategoryQueryParams = {
  _sort: "name",
  _order: "asc",
  _page: 1,
  _limit: 10,
};

export class SupercategoryService {
  private endpoint: string = "/supercategories";
  private api = api;

  async getAll(): Promise<Supercategory[]> {
    const res = await this.api.get(this.endpoint);
    return res.data;
  }

  async getById(id: string): Promise<Supercategory> {
    const res = await this.api.get(`${this.endpoint}/${id}`);
    return res.data;
  }

  async getByQuery(params: SupercategoryQueryParams = {}) {
    const searchParams = new URLSearchParams();

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

  async create(
    Supercategory: Omit<Supercategory, "id">
  ): Promise<Supercategory> {
    const res = await this.api.post(this.endpoint, Supercategory);
    return res.data;
  }

  async update(
    id: string,
    Supercategory: Partial<Supercategory>
  ): Promise<Supercategory> {
    const res = await this.api.put(`${this.endpoint}/${id}`, Supercategory);
    return res.data;
  }

  async delete(id: string): Promise<void> {
    await this.api.delete(`${this.endpoint}/${id}`);
  }
}
