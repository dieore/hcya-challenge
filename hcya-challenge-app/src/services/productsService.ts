import api from "../config/api";

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  description: string;
  sku: string;
  brandId: number;
  subcategoryId: number;
}

export class ProductService {
  private endpoint: string = "/products";
  private api = api;

  async getAll(): Promise<Product[]> {
    const res = await this.api.get(this.endpoint);
    return res.data;
  }

  async getById(id: string): Promise<Product> {
    const res = await this.api.get(`/products/${id}`);
    return res.data;
  }

  async create(product: Omit<Product, "id">): Promise<Product> {
    const res = await this.api.post("/products", product);
    return res.data;
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const res = await this.api.put(`/products/${id}`, product);
    return res.data;
  }

  async delete(id: string): Promise<void> {
    await this.api.delete(`/products/${id}`);
  }
}
