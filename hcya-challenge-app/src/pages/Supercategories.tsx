import { Box, LinearProgress, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useSupercategories } from "../hooks/supercategories";

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Super categoría',
    flex: 1
  },
];

export default function Supercategories() {
  const { data: supercategories, isLoading } = useSupercategories();

  if (isLoading) {
    return <LinearProgress />
  }

  return (
    <Box height={600}>
      <Typography variant="h6" gutterBottom>Super categorías totales: {supercategories?.length}</Typography>
      <DataGrid
        rows={supercategories}
        columns={columns}
        loading={isLoading}
        disableColumnMenu
        disableRowSelectionOnClick
      />
    </Box>
  );
}
