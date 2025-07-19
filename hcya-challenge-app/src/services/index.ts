import { BrandService } from "./brandService";
import { CategoryService } from "./categoryService";
import { ProductService } from "./productService";
import { SubcategoryService } from "./subcategoryService";
import { SupercategoryService } from "./supercategoryService";

const baseURL = import.meta.env.VITE_API_URL;

export const productService = new ProductService(baseURL);
export const brandService = new BrandService(baseURL);
export const categoryService = new CategoryService(baseURL);
export const subcategoryService = new SubcategoryService(baseURL);
export const supercategoryService = new SupercategoryService(baseURL);

