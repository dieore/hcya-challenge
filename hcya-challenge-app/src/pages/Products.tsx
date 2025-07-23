import { Typography, Box, Button } from "@mui/material";
import { useDebounce } from "../hooks/useDebounce";
import { isEqual } from 'lodash';
import { useProducts, useDeleteProduct } from "../hooks/products";
import { useState, useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { showSnackbar } from "../store/snackbar/snackbarSlice";
import { openModal } from '../store/modal/modalSlice';
import { setDirtyState } from '../store/dirty/dirtySlice';
import ProductTable from "../components/Products/ProductTable";
import ProductFilters from "../components/Products/ProductFilters";
import ProductForm from "../components/Products/ProductForm";
import AddIcon from '@mui/icons-material/Add';

import type { Product, Filters } from "../schemas/productSchema";
import type { FilterName } from "../components/Products/ProductFilters";
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';

const initialPaginationModel: GridPaginationModel = { page: 0, pageSize: 10 };
const initialSortModel: GridSortModel = [{ field: 'name', sort: 'asc' }];
const initialFilters: Filters = {
  brandId: [] as string[],
  categoryId: [] as string[],
  subcategoryId: [] as string[],
  supercategoryId: [] as string[],
  price_gte: '',
  price_lte: ''
};

export default function Products() {
  const [paginationModel, setPaginationModel] = useState(initialPaginationModel);
  const [sortModel, setSortModel] = useState(initialSortModel);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 700);

  const [filters, setFilters] = useState(initialFilters);

  const queryParams = {
    name_like: debouncedSearch,
    _page: paginationModel.page + 1,
    _limit: paginationModel.pageSize,
    _sort: sortModel[0]?.field || 'name',
    _order: sortModel[0]?.sort || 'asc',
    brandId: filters.brandId,
    categoryId: filters.categoryId,
    subcategoryId: filters.subcategoryId,
    supercategoryId: filters.supercategoryId,
    ...(filters.price_gte ? { price_gte: Number(filters.price_gte) } : {}),
    ...(filters.price_lte ? { price_lte: Number(filters.price_lte) } : {})
  };

  const { data: products, error, isLoading, refetch } = useProducts(queryParams);
  const { mutate: deleteProduct } = useDeleteProduct();
  const dispatch = useAppDispatch();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);


  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (product: Product) => {
    dispatch(openModal({
      title: 'Confirmar Eliminación',
      message: `¿Estás seguro de que deseas eliminar el producto "${product.name}"?`,
      onConfirm: () => {
        deleteProduct(product.id!, {
          onSuccess: () => {
            dispatch(showSnackbar({ 
              message: 'Producto eliminado exitosamente',
              severity: 'success'
            }));
          },
          onError: (error: Error) => {
            console.error('Error deleting product:', error);
            dispatch(showSnackbar({ 
              message: 'Error al eliminar el producto',
              severity: 'error'
            }));
          }
        });
      }
    }));
  };

  const handleFilterChange = useCallback((filterName: FilterName, newValue: string | string[]) => {
    setFilters(prev => {
      const updatedFilters = { ...prev };
      
      if (filterName === 'price_gte' || filterName === 'price_lte') {
        updatedFilters[filterName] = newValue as string;
      } 
      else if ([
        'brandId', 
        'categoryId', 
        'subcategoryId', 
        'supercategoryId'
      ].includes(filterName)) {
        const value = Array.isArray(newValue) ? newValue : [newValue];
        updatedFilters[filterName as keyof Omit<Filters, 'price_gte' | 'price_lte'>] = value as string[];

        if (filterName === 'supercategoryId') {
          updatedFilters.categoryId = [];
          updatedFilters.subcategoryId = [];
        } else if (filterName === 'categoryId') {
          updatedFilters.subcategoryId = [];
        }
      }
      
      return updatedFilters;
    });
  }, []);

  const handleRemoveFilter = useCallback((filterName: FilterName, value?: string) => {
    if (filterName === 'price_gte' || filterName === 'price_lte') {
      setFilters(prev => ({
        ...prev,
        [filterName]: ''
      }));
    } else if (value) {
      setFilters(prev => ({
        ...prev,
        [filterName]: prev[filterName].filter((v: string) => v !== value)
      }));
    }
  }, []);



  useEffect(() => {
    const hasPaginationChanged = !isEqual(paginationModel, initialPaginationModel);
    const hasSortChanged = !isEqual(sortModel, initialSortModel);
    const hasSearchChanged = search !== "";
    const hasFiltersChanged = !isEqual(filters, initialFilters);

    const isDirty = hasPaginationChanged || hasSortChanged || hasSearchChanged || hasFiltersChanged;
    dispatch(setDirtyState({ model: 'products', key: 'productFilters', isDirty }));
  }, [dispatch, paginationModel, sortModel, search, filters]);

  const isActive = useAppSelector((state) => state.tabs.activeTabId === 'products');

  useEffect(() => {
    if (!isActive) return;
  
    refetch({
      cancelRefetch: false // fuerza que se dispare incluso si ya había uno andando
    });
  }, [isActive]);

  if (error) {
    return (
      <Box p={2}>
        <Typography variant="h4" gutterBottom>
          Error
        </Typography>
        <Typography>
          Ha ocurrido un error al cargar los productos.
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" gap={2} mb={2}>
        <Typography variant="h6">
          Total de productos: {products?.total ? products?.total : '...'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsFormOpen(true)}
        >
          Nuevo Producto
        </Button>
      </Box>

      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        onFilterChange={handleFilterChange}
        onRemoveFilter={handleRemoveFilter}
        isLoading={isLoading}
      />

      <Box mt={2}>
        <ProductTable
          products={products?.data}
          total={products?.total}
          loading={isLoading}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Box>
      
      <ProductForm 
        open={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleSuccess}
        product={editingProduct}
      />


    </Box>
  );
}
