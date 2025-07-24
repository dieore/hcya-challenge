import { Box, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useBrands } from "../hooks/brands";

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Marca',
    flex: 1
  },
];

export default function Brands() {
  const { data: brands, isLoading } = useBrands();

  return (
    <Box height={600}>
      <Typography variant="h6" gutterBottom>Marcas totales: {brands?.length}</Typography>
      <DataGrid
        rows={brands}
        columns={columns}
        loading={isLoading}
        disableColumnMenu
        disableRowSelectionOnClick
      />
    </Box>
  );
}
