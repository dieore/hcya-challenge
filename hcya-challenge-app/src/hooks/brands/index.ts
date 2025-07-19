import { useBaseQuery } from '../useBaseQuery';
import { useBaseMutation } from '../useBaseMutation';
import type { Brand, BrandQueryParams } from '../../services/brandService';
import { brandService } from '../../services';
import { BRANDS_QUERY_KEY } from '../../constants/queryKeys';

type UpdateBrandVariables = {
  id: string;
  brand: Partial<Brand>;
};

export const useBrands = (params: BrandQueryParams = {}) => {
  return useBaseQuery<Brand[], Error, BrandQueryParams>(
    [BRANDS_QUERY_KEY, 'list', params],
    (queryParams: BrandQueryParams) => brandService.getByQuery(queryParams),
    params
  );
};

export const useBrand = (id: string | undefined) => {
  return useBaseQuery<Brand, Error, string>(
    [BRANDS_QUERY_KEY, 'detail', id || ''],
    (brandId: string) => brandService.getById(brandId),
    id || '',
    { 
      enabled: !!id
    }
  );
};

export const useCreateBrand = () => {
  return useBaseMutation<Brand, Error, Omit<Brand, 'id'>>(
    (brand: Omit<Brand, 'id'>) => brandService.create(brand)
  );
};

export const useUpdateBrand = () => {
  return useBaseMutation<Brand, Error, UpdateBrandVariables>(
    ({ id, brand }: UpdateBrandVariables) => brandService.update(id, brand)
  );
};

export const useDeleteBrand = () => {
  return useBaseMutation<void, Error, string>(
    (id: string) => brandService.delete(id)
  );
};
