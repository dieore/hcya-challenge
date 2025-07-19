import { BrandService } from "./brandService";
import { CategoryService } from "./categoryService";
import { ProductService } from "./productService";
import { SubcategoryService } from "./subcategoryService";
import { SupercategoryService } from "./supercategoryService";

export const productService = new ProductService();
export const brandService = new BrandService();
export const categoryService = new CategoryService();
export const subcategoryService = new SubcategoryService();
export const supercategoryService = new SupercategoryService();

