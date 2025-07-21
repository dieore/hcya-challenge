import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Chip } from "@mui/material";
import { useBrands } from "../../hooks/brands";
import { useCategories } from "../../hooks/categories";
import { useSubcategories } from "../../hooks/subcategories";
import { useSupercategories } from "../../hooks/supercategories";

import type { SelectChangeEvent } from "@mui/material/Select";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filters: {
    brandId: string[];
    categoryId: string[];
    subcategoryId: string[];
    supercategoryId: string[];
  };
  onFilterChange: (filterName: string, value: string[]) => void;
  onRemoveFilter: (filterName: string, value: string) => void;
  isLoading?: boolean;
}

export default function ProductFilters({
  search,
  onSearchChange,
  filters,
  onFilterChange,
  onRemoveFilter,
  isLoading = false,
}: ProductFiltersProps) {
  const { data: brands = [] } = useBrands();
  const { data: allCategories = [] } = useCategories();
  const { data: allSubcategories = [] } = useSubcategories();
  const { data: supercategories = [] } = useSupercategories();

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

  const handleFilterSelect = (filterName: string) => (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    const newValue = typeof value === 'string' ? value.split(',') : value;
    onFilterChange(filterName, newValue);
  };

  const getFilterLabel = (filterName: string, value: string) => {
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

  return (
    <>
      <FormControl sx={{ width: 200, marginBottom: 2 }} size="small">
        <TextField
          size="small"
          label="Buscar por nombre"
          variant="outlined"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={isLoading}
        />
      </FormControl>

      <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
        <FormControl sx={{ width: 200 }} size="small">
          <InputLabel>Marca</InputLabel>
          <Select
            multiple
            value={filters.brandId}
            onChange={handleFilterSelect('brandId')}
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
            onChange={handleFilterSelect('supercategoryId')}
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
            onChange={handleFilterSelect('categoryId')}
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
            onChange={handleFilterSelect('subcategoryId')}
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
              label={getFilterLabel(filterName, value)}
              onDelete={() => onRemoveFilter(filterName, value)}
              sx={{ m: 0.5 }}
            />
          ))
        )}
      </Box>
    </>
  );
}
