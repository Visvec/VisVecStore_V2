import { Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function ServerError() {
  const { state } = useLocation();

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: { xs: "90%", sm: "600px" },
        mx: "auto",
        my: 4,
        p: { xs: 2, sm: 4 },
        borderRadius: 2,
      }}
    >
      {state?.error ? (
        <>
          <Typography
            gutterBottom
            variant="h4"
            sx={{ px: { xs: 1, sm: 4 }, pt: 2 }}
            color="secondary"
            textAlign="center"
          >
            {state.error.title}
          </Typography>
          <Divider />
          <Typography variant="body1" sx={{ p: { xs: 1, sm: 4 } }} textAlign="justify">
            {state.error.detail}
          </Typography>
        </>
      ) : (
        <Typography variant="h5" gutterBottom textAlign="center">
          Server error
        </Typography>
      )}
    </Paper>
  );
}
