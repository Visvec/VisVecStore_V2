import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserInfoQuery } from "../../features/account/accountApi";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function RequireAuth() {
  const { data: user, isLoading } = useUserInfoQuery();
  const location = useLocation();

  if (isLoading)
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        px={2}
        textAlign="center"
      >
        <CircularProgress size={48} />
        <Typography variant="h6" mt={2}>
          Loading...
        </Typography>
      </Box>
    );

  if (!user) {
    return <Navigate to="login" state={{ from: location }} />;
  }

  const adminRoutes = [
    '/inventory',
    '/admin-dashboard'
  ]

  if (adminRoutes.includes(location.pathname) && !user.roles.includes('Admin')){
     return <Navigate to= '/' replace />
  }

  return <Outlet />;
}
