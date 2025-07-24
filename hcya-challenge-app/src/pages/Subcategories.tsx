import { Box, LinearProgress, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useSubcategories } from "../hooks/subcategories";

export default function Subcategories() {
  const { data: subcategories, isLoading } = useSubcategories();

  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'Sub-categoría', 
      flex: 1 
    },
    {
      field: 'categoryId',
      headerName: 'Categoría',
      flex: 1,
      renderCell: ({row}) => row.category.name,
    },
  ];

  if (isLoading) {
    return <LinearProgress />
  }

  return (
    <Box height={600}>
      <Typography variant="h6" gutterBottom>
        Sub-categorías totales: {subcategories?.length}
      </Typography>
      <DataGrid
        rows={subcategories}
        columns={columns}
        loading={isLoading}
        disableColumnMenu
        disableRowSelectionOnClick
      />
    </Box>
  );
}
