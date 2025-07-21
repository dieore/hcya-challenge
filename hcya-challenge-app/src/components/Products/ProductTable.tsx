import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import type { Product } from '../../services/productService';
import type { Supercategory } from '../../services/supercategoryService';
import type { Subcategory } from '../../services/subcategoryService';
import type { Category } from '../../services/categoryService';
import type { Brand } from '../../services/brandService';

interface ProductTableProps {
  products: Product[] | undefined;
  total: number | undefined;
  loading: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
}

export default function ProductTable({
  products,
  total,
  loading,
  paginationModel,
  onPaginationModelChange,
}: ProductTableProps) {
  const columns: GridColDef<Product>[] = [
    {
      field: 'name',
      headerName: 'Nombre', 
      flex: 1
    },
    {
      field: 'description',
      headerName: 'Descripción',
      flex: 1
    },
    { field: 'sku', 
      headerName: 'SKU', 
      flex: 1 
    },
    {
      field: 'brand',
      headerName: 'Marca',
      flex: 1,
      valueFormatter: (value: Brand) => value?.name,
    },
    {
      field: 'category',
      headerName: 'Categoría',
      flex: 1,
      valueFormatter: (value: Category) => value?.name,
    },
    {
      field: 'subcategory',
      headerName: 'Subcategoría',
      flex: 1,
      valueFormatter: (value: Subcategory) => value?.name,
    },
    {
      field: 'supercategory',
      headerName: 'Super categoría',
      flex: 1,
      valueFormatter: (value: Supercategory) => value?.name,
    },
    {
      field: 'price',
      headerName: 'Precio',
      type: 'number',
      valueFormatter: (value: number) => `$${value.toFixed(2)}`,
      flex: 1
    },
    {
      field: 'stock',
      headerName: 'Stock',
      type: 'number',
      flex: 1 
    },
  ];

  return (
    <Box height={450}>
      <DataGrid
        rows={products}
        columns={columns}
        rowCount={total}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[5, 10, 25]}
        paginationMode="server"
        getRowId={(row) => row.id}
      />
    </Box>
  );
}
