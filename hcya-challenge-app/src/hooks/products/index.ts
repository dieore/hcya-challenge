import { useBaseQuery } from '../useBaseQuery';
import { useBaseMutation } from '../useBaseMutation';
import type { 
  Product, 
  NewProduct, 
  ProductQueryParams, 
  ProductResponse 
} from '../../services/productService';
import { productService } from '../../services';
import { PRODUCTS_QUERY_KEY } from '../../constants/queryKeys';

type UpdateProductVariables = {
  id: string;
  product: Partial<NewProduct>;
};

export const useProducts = (params: ProductQueryParams = {}) => {
  return useBaseQuery<ProductResponse, Error, ProductQueryParams>(
    [PRODUCTS_QUERY_KEY, 'list', params],
    (queryParams) => productService.getByQuery(queryParams),
    params
  );
};

export const useProduct = (id: string | undefined) => {
  return useBaseQuery<Product, Error, string>(
    [PRODUCTS_QUERY_KEY, 'detail', id || ''],
    (productId: string) => productService.getById(productId),
    id || '',
    { 
      enabled: !!id
    }
  );
};

export const useCreateProduct = () => {
  return useBaseMutation<Product, Error, NewProduct>(
    (product: NewProduct) => productService.create(product as unknown as Omit<Product, 'id'>)
  );
};

export const useUpdateProduct = () => {
  return useBaseMutation<Product, Error, UpdateProductVariables>(
    ({ id, product }: UpdateProductVariables) => productService.update(id, product as Partial<Product>)
  );
};

export const useDeleteProduct = () => {
  return useBaseMutation<void, Error, string>(
    (id: string) => productService.delete(id)
  );
};
