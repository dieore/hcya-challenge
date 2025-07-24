import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Chip, Button, Checkbox, ListItemText, InputAdornment, IconButton } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { useBrands } from "../../hooks/brands";
import { useCategories } from "../../hooks/categories";
import { useSubcategories } from "../../hooks/subcategories";
import { useSupercategories } from "../../hooks/supercategories";
import type { SelectChangeEvent } from "@mui/material/Select";

export type FilterName = 'brandId' | 'categoryId' | 'subcategoryId' | 'supercategoryId' | 'price_gte' | 'price_lte';

export interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filters: {
    brandId: string[];
    categoryId: string[];
    subcategoryId: string[];
    supercategoryId: string[];
    price_gte: string;
    price_lte: string;
  };
  onFilterChange: (filterName: FilterName, value: any) => void;
  onRemoveFilter: (filterName: FilterName, value?: string) => void;
  onClearAllFilters: () => void;
  isLoading?: boolean;
}

export default function ProductFilters({
  search,
  onSearchChange,
  filters,
  onFilterChange,
  onRemoveFilter,
  onClearAllFilters,
  isLoading = false,
}: ProductFiltersProps) {
  const { data: brands = [] } = useBrands();
  const { data: allCategories = [] } = useCategories();
  const { data: allSubcategories = [] } = useSubcategories();
  const { data: supercategories = [] } = useSupercategories();

  const priceRanges = [
    { label: 'Menos de $300', min: 0, max: 300 },
    { label: '$300 - $500', min: 300, max: 500 },
    { label: '$500 - $700', min: 500, max: 700 },
    { label: '$700 - $1,000', min: 700, max: 1000 },
    { label: 'Más de $1,000', min: 1000, max: Infinity }
  ];

  const isPriceRangeActive = (min: number, max: number) => {
    const currentMin = filters.price_gte ? Number(filters.price_gte) : null;
    const currentMax = filters.price_lte ? Number(filters.price_lte) : null;

    if (max === Infinity) {
      return currentMin === min && !currentMax;
    }

    return currentMin === min && currentMax === max;
  };

  const handlePriceRangeClick = (min: number, max: number) => {
    if (isPriceRangeActive(min, max)) {
      onRemoveFilter('price_gte');
      onRemoveFilter('price_lte');
    } else {
      onFilterChange('price_gte', min.toString());

      if (max !== Infinity) {
        onFilterChange('price_lte', max.toString());
      } else {
        onRemoveFilter('price_lte');
      }
    }
  };

  const handleFilterSelect = (filterName: FilterName) => (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    const newValue = typeof value === 'string' ? value.split(',') : value;
    onFilterChange(filterName, newValue);
  };

  const getFilterLabel = (filterName: FilterName, value: string) => {
    switch (filterName) {
      case 'brandId':
        return brands.find(b => b.id === value)?.name || value;
      case 'supercategoryId':
        return supercategories.find(s => s.id === value)?.name || value;
      case 'categoryId':
        return allCategories.find(c => c.id === value)?.name || value;
      case 'subcategoryId':
        return allSubcategories.find(s => s.id === value)?.name || value;
      case 'price_gte':
      case 'price_lte':
        return value;
    }
  };

  return (
    <>
      <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
        <FormControl sx={{ flex: 1 }} size="small">
          <TextField
            size="small"
            label="Buscar por nombre"
            variant="outlined"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {search && (
                    <IconButton
                      onClick={() => onSearchChange('')}
                      edge="end"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )}
                </InputAdornment>
              )
            }}
          />
        </FormControl>

        <FormControl sx={{ flex: 1 }} size="small">
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
                <Checkbox checked={filters.brandId.includes(brand.id)} />
                <ListItemText primary={brand.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ flex: 1 }} size="small">
          <InputLabel>Super categoría</InputLabel>
          <Select
            multiple
            value={filters.supercategoryId}
            onChange={handleFilterSelect('supercategoryId')}
            label="Super categoría"
            renderValue={(selected) => selected.map(id => getFilterLabel('supercategoryId', id)).join(', ')}
          >
            {supercategories.map((supercategory) => (
              <MenuItem key={supercategory.id} value={supercategory.id}>
                <Checkbox checked={filters.supercategoryId.includes(supercategory.id)} />
                <ListItemText primary={supercategory.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ flex: 1 }} size="small">
          <InputLabel>Categoría</InputLabel>
          <Select
            multiple
            value={filters.categoryId}
            onChange={handleFilterSelect('categoryId')}
            label="Categoría"
            disabled={filters.supercategoryId.length === 0}
            renderValue={(selected) => selected.map(id => getFilterLabel('categoryId', id)).join(', ')}
          >
            {allCategories.length === 0 ? (
              <MenuItem disabled>Seleccione una supercategoría primero</MenuItem>
            ) : (
              allCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Checkbox checked={filters.categoryId.includes(category.id)} />
                  <ListItemText primary={category.name} />
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <FormControl sx={{ flex: 1 }} size="small">
          <InputLabel>Sub categoría</InputLabel>
          <Select
            multiple
            value={filters.subcategoryId}
            onChange={handleFilterSelect('subcategoryId')}
            label="Sub categoría"
            disabled={filters.categoryId.length === 0}
            renderValue={(selected) => selected.map(id => getFilterLabel('subcategoryId', id)).join(', ')}
          >
            {allSubcategories.length === 0 ? (
              <MenuItem disabled>Seleccione una categoría primero</MenuItem>
            ) : (
              allSubcategories.map((subcategory) => (
                <MenuItem key={subcategory.id} value={subcategory.id}>
                  <Checkbox checked={filters.subcategoryId.includes(subcategory.id)} />
                  <ListItemText primary={subcategory.name} />
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <Button
          onClick={onClearAllFilters}
          disabled={isLoading}
        >
          Limpiar filtros
        </Button>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
        {Object.entries(filters).map(([filterName, values]) => {
          const typedFilterName = filterName as FilterName;

          if (typedFilterName === 'price_gte' || typedFilterName === 'price_lte') {
            const priceValue = filters[typedFilterName];
            if (!priceValue) return null;
            const label = typedFilterName === 'price_gte'
              ? `Precio desde: $${priceValue}`
              : `Precio hasta: $${priceValue}`;
            return (
              <Chip
                key={typedFilterName}
                label={label}
                onDelete={() => onRemoveFilter(typedFilterName)}
                sx={{ m: 0.5 }}
              />
            );
          }

          const arrayFilterName = typedFilterName as Exclude<FilterName, 'price_gte' | 'price_lte'>;
          const filterValues = Array.isArray(values) ? values : [];

          return filterValues.map((value: string) => (
            <Chip
              key={`${arrayFilterName}-${value}`}
              label={getFilterLabel(arrayFilterName, value)}
              onDelete={() => onRemoveFilter(arrayFilterName, value)}
              sx={{ m: 0.5 }}
            />
          ));
        })}
      </Box>


      <Box display="flex" flexWrap="wrap" gap={1}>
        {priceRanges.map((range) => {
          const isActive = isPriceRangeActive(range.min, range.max);
          return (
            <Button
              key={range.label}
              variant={isActive ? 'contained' : 'outlined'}
              onClick={() => handlePriceRangeClick(range.min, range.max)}
            >
              {range.label}
            </Button>
          );
        })}
      </Box>
    </>
  );
}
