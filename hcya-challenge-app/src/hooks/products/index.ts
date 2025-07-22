import { useBaseQuery } from '../useBaseQuery';
import { useQueryClient } from '@tanstack/react-query';
import { useBaseMutation } from '../useBaseMutation';
import type { 
  ProductQueryParams, 
  ProductResponse 
} from '../../services/productService';
import { productService } from '../../services';
import { PRODUCTS_QUERY_KEY } from '../../constants/queryKeys';
import type { Product } from '../../schemas/productSchema';

export type UpdateProductVariables = {
  id: string;
  product: Partial<Product>;
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
  const queryClient = useQueryClient();

  return useBaseMutation<Product, Error, Product>(
    (product: Product) => productService.create(product as Omit<Product, 'id'>),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      },
    }
  );
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useBaseMutation<Product, Error, UpdateProductVariables>(
    ({ id, product }: UpdateProductVariables) => productService.update(id, product as Partial<Product>),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      },
    }
  );
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useBaseMutation<void, Error, string>(
    (id: string) => productService.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
      },
    }
  );
};
