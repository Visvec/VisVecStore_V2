import { SearchOff } from "@mui/icons-material";
import { Box, Button, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box 
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      px={{ xs: 2, sm: 4 }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 600,
          py: { xs: 4, sm: 6 },
          px: { xs: 3, sm: 6 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <SearchOff sx={{ fontSize: isSmallScreen ? 60 : 100 }} color="primary" />
        <Typography gutterBottom variant={isSmallScreen ? "h5" : "h3"}>
          Oops - we could not find what you were looking for
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/catalog"
          sx={{ mt: 3 }}
          fullWidth={isSmallScreen}
        >
          Go back to shop
        </Button>
      </Paper>
    </Box>
  );
}
