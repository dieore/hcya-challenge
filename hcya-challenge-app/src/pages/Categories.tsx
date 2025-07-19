import { Typography, Box, TextField, Button } from "@mui/material";
import { useState } from "react";

export default function Categories() {
  const [newCategory, setNewCategory] = useState("");

  const handleAdd = () => {
    if (newCategory.trim()) {
      setNewCategory("");
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Categorías
      </Typography>

      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          label="Nueva categoría"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button onClick={handleAdd} variant="contained" sx={{ ml: 2 }}>
          Agregar
        </Button>
      </Box>
    </Box>
  );
}
