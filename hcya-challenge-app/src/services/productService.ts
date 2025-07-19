import axios from "axios";
import type { AxiosInstance } from "axios";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  sku: string;
  imgUrl: string;
  brandId: number;
  subcategoryId: number;
  categoryId: number;
  supercategoryId: number;
}

export interface NewProduct {
  id?: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  sku: string;
  imgUrl: string;
  brandId: string;
  subcategoryId: string;
  categoryId: string;
  supercategoryId: string;
}
export interface ProductQueryParams {
  _sort?: string;
  _order?: "asc" | "desc";
  _page?: number;
  _limit?: number;
  brandId?: string[];
  subcategoryId?: string[];
  categoryId?: string[];
  supercategoryId?: string[];
  name_like?: string;
  description_like?: string;
  sku_like?: string;
  stock_gte?: number;
  stock_lte?: number;
  price_gte?: number;
  price_lte?: number;
}

export const initialProductFilters: ProductQueryParams = {
  _sort: "name",
  _order: "asc",
  _page: 1,
  _limit: 10,
  brandId: [],
  categoryId: [],
  subcategoryId: [],
  supercategoryId: [],
  name_like: "",
  description_like: "",
  sku_like: "",
  stock_gte: undefined,
  stock_lte: undefined,
  price_gte: undefined,
  price_lte: undefined,
};

export const initialNewProduct = {
  id: "",
  name: "",
  price: 0,
  stock: 0,
  description: "",
  sku: "",
  imgUrl: "",
  brandId: "",
  subcategoryId: "",
  categoryId: "",
  supercategoryId: "",
};

export interface ProductResponse {
  data: Product[];
  total: number;
}

export class ProductService {
  private api: AxiosInstance;
  private endpoint: string = "/products";

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getAll(): Promise<ProductResponse> {
    const res = await this.api.get(this.endpoint);
    return res.data;
  }

  async getByQuery(params: ProductQueryParams = {}): Promise<ProductResponse> {
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
    const total = parseInt(response.headers["x-total-count"], 10) || 0;

    return {
      data: response.data,
      total,
    };
  }

  async getById(id: string): Promise<Product> {
    const res = await this.api.get(`${this.endpoint}/${id}`);
    return res.data;
  }

  async create(product: Omit<Product, "id">): Promise<Product> {
    const res = await this.api.post(this.endpoint, product);
    return res.data;
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const res = await this.api.put(`${this.endpoint}/${id}`, product);
    return res.data;
  }

  async delete(id: string): Promise<void> {
    await this.api.delete(`${this.endpoint}/${id}`);
  }
}
