import { Typography, Box, TextField, CircularProgress, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useProducts } from "../hooks/products";
import ProductTable from "../components/Products/ProductTable";
import type { GridPaginationModel } from '@mui/x-data-grid';

export default function Products() {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 700);

  const { data: products, error, isLoading } = useProducts({
    name_like: debouncedSearch,
    _page: paginationModel.page + 1,
    _limit: paginationModel.pageSize,
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
      <Typography variant="h4" gutterBottom>
        Productos
      </Typography>
      <Box display="flex" alignItems="center" gap={2}>
        <Typography variant="h6" gutterBottom>
          Total: {isLoading ? <CircularProgress size={16} /> : products?.total}
        </Typography>
      </Box>

      <TextField
        label="Buscar productos por nombre"
        variant="outlined"
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Box sx={{ mt: 2 }}>
        <ProductTable
          products={products?.data}
          total={products?.total}
          loading={isLoading}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </Box>
    </Box>
  );
}
