import { Typography, Box, Button, TextField } from "@mui/material";
import { useState } from "react";

export default function Products() {
  const [search, setSearch] = useState("");

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
    </Box>
  );
}
