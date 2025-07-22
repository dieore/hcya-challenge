import { z } from 'zod';

export const productFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  sku: z.string().min(1, 'El SKU es requerido'),
  description: z.string().optional(),
  price: z.number()
    .min(1, 'El precio es requerido')
    .refine(val => val > 0, {
      message: 'El precio debe ser mayor a 0'
    }),
  stock: z.number()
    .min(1, 'El stock es requerido')
    .refine(val => val >= 0, {
      message: 'El stock no puede ser negativo'
    }),
  imgUrl: z.string()
    .min(1, 'La URL de la imagen es requerida')
    .refine(val => !val || val === '' || /^https?:\/\//.test(val), {
      message: 'Debe ser una URL válida que comience con http:// o https://',
    }),
  brandId: z.string().min(1, 'La marca es requerida'),
  supercategoryId: z.string().min(1, 'La supercategoría es requerida'),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  subcategoryId: z.string().min(1, 'La subcategoría es requerida'),
  id: z.string().optional(),
});

export type Product = z.infer<typeof productFormSchema>;
