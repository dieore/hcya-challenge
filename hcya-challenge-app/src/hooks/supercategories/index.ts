import { useBaseQuery } from '../useBaseQuery';
import { useBaseMutation } from '../useBaseMutation';
import type { Supercategory, SupercategoryQueryParams } from '../../services/supercategoryService';
import { supercategoryService } from '../../services';
import { SUPERCATEGORIES_QUERY_KEY } from '../../constants/queryKeys';

type UpdateSupercategoryVariables = {
  id: string;
  supercategory: Partial<Supercategory>;
};

export const useSupercategories = (params: SupercategoryQueryParams = {}) => {
  return useBaseQuery<Supercategory[], Error, SupercategoryQueryParams>(
    [SUPERCATEGORIES_QUERY_KEY, 'list', params],
    (queryParams: SupercategoryQueryParams) => supercategoryService.getByQuery(queryParams),
    params
  );
};

export const useSupercategory = (id: string | undefined) => {
  return useBaseQuery<Supercategory, Error, string>(
    [SUPERCATEGORIES_QUERY_KEY, 'detail', id || ''],
    (supercategoryId: string) => supercategoryService.getById(supercategoryId),
    id || '',
    { 
      enabled: !!id
    }
  );
};

export const useCreateSupercategory = () => {
  return useBaseMutation<Supercategory, Error, Omit<Supercategory, 'id'>>(
    (supercategory: Omit<Supercategory, 'id'>) => supercategoryService.create(supercategory)
  );
};

export const useUpdateSupercategory = () => {
  return useBaseMutation<Supercategory, Error, UpdateSupercategoryVariables>(
    ({ id, supercategory }: UpdateSupercategoryVariables) => 
      supercategoryService.update(id, supercategory)
  );
};

export const useDeleteSupercategory = () => {
  return useBaseMutation<void, Error, string>(
    (id: string) => supercategoryService.delete(id)
  );
};
