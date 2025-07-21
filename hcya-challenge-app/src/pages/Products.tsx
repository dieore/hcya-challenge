import { Typography, Box, CircularProgress } from "@mui/material";
import { useDebounce } from "../hooks/useDebounce";
import { useProducts } from "../hooks/products";
import { useState, useCallback } from "react";
import ProductTable from "../components/Products/ProductTable";
import ProductFilters from "../components/Products/ProductFilters";

import type { FilterName } from "../components/Products/ProductFilters";
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';

export default function Products() {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'name', sort: 'asc' }]);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 700);

  const [filters, setFilters] = useState({
    brandId: [] as string[],
    categoryId: [] as string[],
    subcategoryId: [] as string[],
    supercategoryId: [] as string[],
    price_gte: '',
    price_lte: ''
  });

  interface Filters {
    brandId: string[];
    categoryId: string[];
    subcategoryId: string[];
    supercategoryId: string[];
    price_gte: string;
    price_lte: string;
  }


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

  const { data: products, error, isLoading } = useProducts(queryParams);

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
      <Box display="flex" alignItems="center" justifyContent="space-between" gap={2} mb={2}>
        <Typography variant="h4">
          Productos
        </Typography>
        <Typography variant="h6">
          Resultados totales: {isLoading ? <CircularProgress size={16} /> : products?.total}
        </Typography>
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
        />
      </Box>
    </Box>
  );
}
