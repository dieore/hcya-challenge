import { useBaseQuery } from '../useBaseQuery';
import { useBaseMutation } from '../useBaseMutation';
import type { Category, CategoryQueryParams } from '../../services/categoryService';
import { categoryService } from '../../services';
import { CATEGORIES_QUERY_KEY } from '../../constants/queryKeys';

type UpdateCategoryVariables = {
  id: string;
  category: Partial<Category>;
};

export const useCategories = (params: CategoryQueryParams = {}) => {
  return useBaseQuery<Category[], Error, CategoryQueryParams>(
    [CATEGORIES_QUERY_KEY, 'list', params],
    (queryParams: CategoryQueryParams) => categoryService.getByQuery(queryParams),
    params
  );
};

export const useCategory = (id: string | undefined) => {
  return useBaseQuery<Category, Error, string>(
    [CATEGORIES_QUERY_KEY, 'detail', id || ''],
    (categoryId: string) => categoryService.getById(categoryId),
    id || '',
    { 
      enabled: !!id
    }
  );
};

export const useCreateCategory = () => {
  return useBaseMutation<Category, Error, Omit<Category, 'id'>>(
    (category: Omit<Category, 'id'>) => categoryService.create(category)
  );
};

export const useUpdateCategory = () => {
  return useBaseMutation<Category, Error, UpdateCategoryVariables>(
    ({ id, category }: UpdateCategoryVariables) => 
      categoryService.update(id, category)
  );
};

export const useDeleteCategory = () => {
  return useBaseMutation<void, Error, string>(
    (id: string) => categoryService.delete(id)
  );
};
