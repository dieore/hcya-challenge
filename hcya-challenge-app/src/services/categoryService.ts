import axios from "axios";
import type { AxiosInstance } from "axios";

export interface Category {
  id: string;
  name: string;
  supercategoryId: number;
}

export interface CategoryQueryParams {
  _sort?: string;
  _order?: "asc" | "desc";
  _page?: number;
  _limit?: number;
  supercategoryId?: string[];
  name_like?: string;
}

export const initialCategoryFilters: CategoryQueryParams = {
  _sort: "name",
  _order: "asc",
  _page: 1,
  _limit: 10,
};

export class CategoryService {
  private api: AxiosInstance;
  private endpoint: string = "/categories";

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getAll(): Promise<Category[]> {
    const res = await this.api.get(this.endpoint);
    return res.data;
  }

  async getByQuery(params: CategoryQueryParams = {}) {
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

  async getById(id: string): Promise<Category> {
    const res = await this.api.get(`${this.endpoint}/${id}`);
    return res.data;
  }

  async create(Category: Omit<Category, "id">): Promise<Category> {
    const res = await this.api.post(this.endpoint, Category);
    return res.data;
  }

  async update(id: string, Category: Partial<Category>): Promise<Category> {
    const res = await this.api.put(`${this.endpoint}/${id}`, Category);
    return res.data;
  }

  async delete(id: string): Promise<void> {
    await this.api.delete(`${this.endpoint}/${id}`);
  }
}
