import { Typography, Box } from "@mui/material";

export default function Home() {
  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Inicio
      </Typography>
      <Typography>
        Bienvenido al panel de administración. Usa el menú lateral para navegar
        entre secciones.
      </Typography>
    </Box>
  );
}
