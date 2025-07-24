import api from "../config/api";
import type { Product } from "../schemas/productSchema";

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

export interface ProductResponse {
  data: Product[];
  total: number;
}

export class ProductService {
  private endpoint: string = "/products";
  private api = api;

  async getAll(): Promise<ProductResponse> {
    const res = await this.api.get(this.endpoint);
    return res.data;
  }

  async getByQuery(params: ProductQueryParams = {}): Promise<ProductResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append('_expand', 'brand');
    searchParams.append('_expand', 'category');
    searchParams.append('_expand', 'subcategory');
    searchParams.append('_expand', 'supercategory');

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
    const res = await this.api.get(`${this.endpoint}/${id}?_expand=brand&_expand=category&_expand=subcategory&_expand=supercategory`);
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
