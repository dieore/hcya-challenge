import { useBaseQuery } from '../useBaseQuery';
import { useBaseMutation } from '../useBaseMutation';
import type { Subcategory, SubcategoryQueryParams } from '../../services/subcategoryService';
import { subcategoryService } from '../../services';
import { SUBCATEGORIES_QUERY_KEY } from '../../constants/queryKeys';

type UpdateSubcategoryVariables = {
  id: string;
  subcategory: Partial<Subcategory>;
};

export const useSubcategories = (params: SubcategoryQueryParams = {}) => {
  return useBaseQuery<Subcategory[], Error, SubcategoryQueryParams>(
    [SUBCATEGORIES_QUERY_KEY, 'list', params],
    (queryParams: SubcategoryQueryParams) => subcategoryService.getByQuery(queryParams),
    params
  );
};

export const useSubcategory = (id: string | undefined) => {
  return useBaseQuery<Subcategory, Error, string>(
    [SUBCATEGORIES_QUERY_KEY, 'detail', id || ''],
    (subcategoryId: string) => subcategoryService.getById(subcategoryId),
    id || '',
    { 
      enabled: !!id
    }
  );
};

export const useCreateSubcategory = () => {
  return useBaseMutation<Subcategory, Error, Omit<Subcategory, 'id'>>(
    (subcategory: Omit<Subcategory, 'id'>) => subcategoryService.create(subcategory)
  );
};

export const useUpdateSubcategory = () => {
  return useBaseMutation<Subcategory, Error, UpdateSubcategoryVariables>(
    ({ id, subcategory }: UpdateSubcategoryVariables) => 
      subcategoryService.update(id, subcategory)
  );
};

export const useDeleteSubcategory = () => {
  return useBaseMutation<void, Error, string>(
    (id: string) => subcategoryService.delete(id)
  );
};
