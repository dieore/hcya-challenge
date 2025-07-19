import api from "../config/api";

export interface Brand {
  id: string;
  name: string;
}

export interface BrandQueryParams {
  _sort?: string;
  _order?: "asc" | "desc";
  _page?: number;
  _limit?: number;
  name_like?: string;
}

export const initialBrandFilters: BrandQueryParams = {
  _sort: "name",
  _order: "asc",
  _page: 1,
  _limit: 10,
};

export class BrandService {
  private endpoint: string = "/brands";
  private api = api;

  async getAll(): Promise<Brand[]> {
    const res = await this.api.get(this.endpoint);
    return res.data;
  }

  async getByQuery(params: BrandQueryParams = {}) {
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

  async getById(id: string): Promise<Brand> {
    const res = await this.api.get(`${this.endpoint}/${id}`);
    return res.data;
  }

  async create(Brand: Omit<Brand, "id">): Promise<Brand> {
    const res = await this.api.post(this.endpoint, Brand);
    return res.data;
  }

  async update(id: string, Brand: Partial<Brand>): Promise<Brand> {
    const res = await this.api.put(`${this.endpoint}/${id}`, Brand);
    return res.data;
  }

  async delete(id: string): Promise<void> {
    await this.api.delete(`${this.endpoint}/${id}`);
  }
}
