import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import NavBar from "./NavBar";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { useAppSelector } from "../store/store";

function App() {
  const { darkMode } = useAppSelector((state) => state.ui);
  const paletteType = darkMode ? "dark" : "light";

  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === "light" ? "#eaeaea" : "#121212",
      },
    },
    typography: {
      fontFamily: "Inter, Roboto, sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <ScrollRestoration />
      <CssBaseline />
      <NavBar />
      <Box
        sx={{
          minHeight: "100vh",
          background: darkMode
            ? "radial-gradient(circle, #1e3aBa, #111B27)"
            : "radial-gradient(circle, #baecf9, #f0f9ff)",
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 1, sm: 2 },
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            mt: { xs: 4, sm: 6 },
            px: { xs: 1, sm: 2, md: 4 },
          }}
        >
          <Outlet />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
