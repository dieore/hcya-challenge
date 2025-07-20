import { Typography, Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useProducts } from "../hooks/products";
import type { Product } from "../services/productService";

export default function Products() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data: products, error } = useProducts({
    name_like: debouncedSearch,
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

      <Box mb={2}>
        <TextField
          label="Buscar productos"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" sx={{ ml: 2 }}>
          Buscar
        </Button>
      </Box>

      <Typography>
        Resultados para: {search || "todos los productos"}
      </Typography>

      {
        products?.data?.map((product: Product) => (
          <>
            <Box key={product.id}>  
              <Typography>{product.name}</Typography>
              <Typography>{product.price}</Typography>
              <Typography>{product.stock}</Typography>
              <Typography>{product.category?.name}</Typography>
              <Typography>{product.subcategory?.name}</Typography>
              <Typography>{product.brand?.name}</Typography>
            </Box>
            <br />
          </>
        ))
      }
    </Box>
  );
}
