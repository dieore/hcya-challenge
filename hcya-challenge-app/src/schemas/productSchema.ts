import { z } from 'zod';

export const productFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  sku: z.string().min(1, 'El SKU es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  price: z.string()
    .min(1, 'El precio es requerido')
    .regex(/^\d+(\.\d{1,2})?$/, 'Debe ser un número válido')
    .refine(val => parseFloat(val) > 0, {
      message: 'El precio debe ser mayor a 0'
    }),
  stock: z.string()
    .min(1, 'El stock es requerido')
    .regex(/^\d+$/, 'Debe ser un número entero')
    .refine(val => parseInt(val, 10) >= 0, {
      message: 'El stock no puede ser negativo'
    }),
  imgUrl: z.string()
    .refine(val => !val || val === '' || /^https?:\/\//.test(val), {
      message: 'Debe ser una URL válida que comience con http:// o https://',
    }),
  brandId: z.string().min(1, 'La marca es requerida'),
  supercategoryId: z.string().min(1, 'La supercategoría es requerida'),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  subcategoryId: z.string().min(1, 'La subcategoría es requerida'),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

// Helper function to convert form data to API data
export const mapFormDataToApiData = (data: ProductFormData) => ({
  ...data,
  price: parseFloat(data.price),
  stock: parseInt(data.stock, 10),
  brandId: parseInt(data.brandId, 10),
  supercategoryId: parseInt(data.supercategoryId, 10),
  categoryId: parseInt(data.categoryId, 10),
  subcategoryId: parseInt(data.subcategoryId, 10),
});
