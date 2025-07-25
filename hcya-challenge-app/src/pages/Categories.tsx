import { Box, LinearProgress, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useCategories } from "../hooks/categories";

export default function Categories() {
  const { data: categories, isLoading } = useCategories();

  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'Categoría', 
      flex: 1 
    },
    {
      field: 'supercategory',
      headerName: 'Super Categoría',
      flex: 1,
      renderCell: ({row}) => row.supercategory.name,
    },
  ];

  if (isLoading) {
    return <LinearProgress />
  }

  return (
    <Box height={600}>
      <Typography variant="h6" gutterBottom>Categorías totales: {categories?.length}</Typography>
      <DataGrid
        rows={categories}
        columns={columns}
        loading={isLoading}
        disableColumnMenu
        disableRowSelectionOnClick
      />
    </Box>
  );
}
