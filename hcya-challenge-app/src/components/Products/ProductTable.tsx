import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import type { GridColDef, GridPaginationModel, GridSortModel, GridRowParams } from '@mui/x-data-grid';
import type { Product } from '../../schemas/productSchema';
import type { Supercategory } from '../../services/supercategoryService';
import type { Subcategory } from '../../services/subcategoryService';
import type { Category } from '../../services/categoryService';
import type { Brand } from '../../services/brandService';

interface ProductTableProps {
  products: Product[] | undefined;
  total: number | undefined;
  loading: boolean;
  paginationModel: GridPaginationModel;
  sortModel?: GridSortModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onSortModelChange?: (model: GridSortModel) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export default function ProductTable({
  products,
  total,
  loading,
  paginationModel,
  onPaginationModelChange,
  sortModel = [{ field: 'name', sort: 'asc' }],
  onSortModelChange = () => {},
  onEdit,
  onDelete,
}: ProductTableProps) {
  const columns: GridColDef<Product>[] = [
    {
      field: 'name',
      headerName: 'Nombre',
      flex: 1,
      sortable: true
    },
    {
      field: 'description',
      headerName: 'Descripción',
      flex: 1,
      sortable: true
    },
    { 
      field: 'sku', 
      headerName: 'SKU', 
      flex: 1,
      sortable: true
    },
    {
      field: 'brand',
      headerName: 'Marca',
      flex: 1,
      sortable: true,
      sortComparator: (v1: Brand, v2: Brand) => (v1?.name || '').localeCompare(v2?.name || ''),
      valueFormatter: (value: Brand) => value?.name
    },
    {
      field: 'category',
      headerName: 'Categoría',
      flex: 1,
      sortable: true,
      sortComparator: (v1: Category, v2: Category) => (v1?.name || '').localeCompare(v2?.name || ''),
      valueFormatter: (value: Category) => value?.name
    },
    {
      field: 'subcategory',
      headerName: 'Subcategoría',
      flex: 1,
      sortable: true,
      sortComparator: (v1: Subcategory, v2: Subcategory) => (v1?.name || '').localeCompare(v2?.name || ''),
      valueFormatter: (value: Subcategory) => value?.name
    },
    {
      field: 'supercategory',
      headerName: 'Super categoría',
      flex: 1,
      sortable: true,
      sortComparator: (v1: Supercategory, v2: Supercategory) => (v1?.name || '').localeCompare(v2?.name || ''),
      valueFormatter: (value: Supercategory) => value?.name
    },
    {
      field: 'price',
      headerName: 'Precio',
      type: 'number',
      sortable: true,
      flex: 1,
      valueFormatter: (value: number) => `$${value.toFixed(2)}`
    },
    {
      field: 'imgUrl',
      headerName: 'Imagen',
      width: 100,
      renderCell: (params) => (
        <img 
          src={params.value} 
          alt={params.row.name} 
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }} 
        />
      ),
      sortable: false,
    },
    {
      field: 'stock',
      headerName: 'Stock',
      type: 'number',
      sortable: true,
      flex: 1
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 100,
      cellClassName: 'actions',
      getActions: (params: GridRowParams<Product>) => [
        <GridActionsCellItem
          key="edit"
          icon={
            <IconButton>
              <EditIcon />
            </IconButton>
          }
          label="Editar"
          onClick={() => onEdit?.(params.row)}
          showInMenu={true}
        />,
        <GridActionsCellItem
          key="delete"
          icon={
            <IconButton>
              <DeleteIcon />
            </IconButton>
          }
          label="Eliminar"
          onClick={() => onDelete?.(params.row)}
          showInMenu={true}
        />
      ]
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
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        pageSizeOptions={[5, 10, 25]}
        paginationMode="server"
        sortingMode="server"
        getRowId={(row) => row.id!}
        disableColumnMenu
        disableRowSelectionOnClick
      />
    </Box>
  );
}
