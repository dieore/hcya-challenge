import { Typography, Box, TextField, CircularProgress, FormControl, InputLabel, Select, MenuItem, Chip } from "@mui/material";
import { useDebounce } from "../hooks/useDebounce";
import { useProducts } from "../hooks/products";
import { useBrands } from "../hooks/brands";
import { useCategories } from "../hooks/categories";
import { useSubcategories } from "../hooks/subcategories";
import { useSupercategories } from "../hooks/supercategories";
import { useState } from "react";
import ProductTable from "../components/Products/ProductTable";

import type { SelectChangeEvent } from "@mui/material/Select";
import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';

export default function Products() {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'name', sort: 'asc' }]);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    brandId: [] as string[],
    categoryId: [] as string[],
    subcategoryId: [] as string[],
    supercategoryId: [] as string[],
  });

  const debouncedSearch = useDebounce(search, 700);

  // Fetch filter options
  const { data: brands = [] } = useBrands();
  const { data: allCategories = [] } = useCategories();
  const { data: allSubcategories = [] } = useSubcategories();
  const { data: supercategories = [] } = useSupercategories();

  // Filter categories and subcategories based on parent selections
  const filteredCategories = filters.supercategoryId.length > 0
    ? allCategories.filter(cat =>
      filters.supercategoryId.includes(cat.supercategoryId.toString())
    )
    : [];

  const filteredSubcategories = filters.categoryId.length > 0
    ? allSubcategories.filter(sub =>
      filters.categoryId.includes(sub.categoryId.toString())
    )
    : [];

  const handleFilterChange = (filterName: keyof typeof filters) => (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    const newValue = typeof value === 'string' ? value.split(',') : value;

    setFilters(prev => {
      const updatedFilters = { ...prev, [filterName]: newValue };

      // Reset child filters when parent changes
      if (filterName === 'supercategoryId') {
        updatedFilters.categoryId = [];
        updatedFilters.subcategoryId = [];
      } else if (filterName === 'categoryId') {
        updatedFilters.subcategoryId = [];
      }

      return updatedFilters;
    });
  };

  const getFilterLabel = (filterName: keyof typeof filters, value: string) => {
    switch (filterName) {
      case 'brandId':
        return brands.find(b => b.id.toString() === value)?.name || value;
      case 'supercategoryId':
        return supercategories.find(s => s.id.toString() === value)?.name || value;
      case 'categoryId':
        return allCategories.find(c => c.id.toString() === value)?.name || value;
      case 'subcategoryId':
        return allSubcategories.find(s => s.id.toString() === value)?.name || value;
      default:
        return value;
    }
  };

  const { data: products, error, isLoading } = useProducts({
    name_like: debouncedSearch,
    _page: paginationModel.page + 1,
    _limit: paginationModel.pageSize,
    _sort: sortModel[0]?.field || 'name',
    _order: sortModel[0]?.sort || 'asc',
    ...filters,
  });

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

      <FormControl sx={{ width: 200, marginBottom: 2 }} size="small">
        <TextField
          size="small"
          label="Buscar por nombre"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isLoading}
        />
      </FormControl>

      <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
        <FormControl sx={{ width: 200 }} size="small">
          <InputLabel>Marca</InputLabel>
          <Select
            multiple
            value={filters.brandId}
            onChange={handleFilterChange('brandId')}
            label="Marca"
            renderValue={(selected) => selected.map(id => getFilterLabel('brandId', id)).join(', ')}      
          >
            {brands.map((brand) => (
              <MenuItem key={brand.id} value={brand.id}>
                {brand.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: 200 }} size="small">
          <InputLabel>Supercategoría</InputLabel>
          <Select
            multiple
            value={filters.supercategoryId}
            onChange={handleFilterChange('supercategoryId')}
            label="Supercategoría"
            renderValue={(selected) => selected.map(id => getFilterLabel('supercategoryId', id)).join(', ')}
          >
            {supercategories.map((supercategory) => (
              <MenuItem key={supercategory.id} value={supercategory.id}>
                {supercategory.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: 200 }} size="small">
          <InputLabel>Categoría</InputLabel>
          <Select
            multiple
            value={filters.categoryId}
            onChange={handleFilterChange('categoryId')}
            label="Categoría"
            disabled={filters.supercategoryId.length === 0}
            renderValue={(selected) => selected.map(id => getFilterLabel('categoryId', id)).join(', ')}
          >
            {filteredCategories.length === 0 ? (
              <MenuItem disabled>Seleccione una supercategoría primero</MenuItem>
            ) : (
              filteredCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <FormControl sx={{ width: 200 }} size="small">
          <InputLabel>Subcategoría</InputLabel>
          <Select
            multiple
            value={filters.subcategoryId}
            onChange={handleFilterChange('subcategoryId')}
            label="Subcategoría"
            disabled={filters.categoryId.length === 0}
            renderValue={(selected) => selected.map(id => getFilterLabel('subcategoryId', id)).join(', ')}
          >
            {filteredSubcategories.length === 0 ? (
              <MenuItem disabled>Seleccione una categoría primero</MenuItem>
            ) : (
              filteredSubcategories.map((subcategory) => (
                <MenuItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
        {Object.entries(filters).map(([filterName, values]) => 
          values.map(value => (
            <Chip
              key={`${filterName}-${value}`}
              label={getFilterLabel(filterName as keyof typeof filters, value)}
              onDelete={() => {
                setFilters(prev => ({
                  ...prev,
                  [filterName]: prev[filterName as keyof typeof filters].filter(v => v !== value)
                }));
              }}
              sx={{ m: 0.5 }}
            />
          ))
        )}
      </Box>

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
