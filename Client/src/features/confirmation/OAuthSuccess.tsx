import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import {
  Container,
  Typography,
  Avatar,
  CircularProgress,
  Box,
  Alert,
  Paper,
} from "@mui/material";

interface JwtPayload {
  email: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  exp: number;
}

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("Missing token from OAuth provider.");
      navigate("/login");
      return;
    }

    try {
      localStorage.setItem("jwt", token);

      const decoded = jwtDecode<JwtPayload>(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("jwt");
        setError("Token has expired. Please log in again.");
        navigate("/login");
        return;
      }

      setUser(decoded);

      const timer = setTimeout(() => {
        navigate("/catalog");
      }, 1500);

      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("jwt");
      setError("Invalid token received.");
      navigate("/login");
    }
  }, [navigate, searchParams]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : user ? (
          <>
            <Typography variant="h5" gutterBottom>
              Welcome, {user.firstName} {user.lastName}!
            </Typography>
            {user.photoUrl && (
              <Avatar
                src={user.photoUrl}
                alt="User avatar"
                sx={{ width: 80, height: 80, mx: "auto", my: 2 }}
              />
            )}
            <Typography variant="body1" gutterBottom>
              Logging you in...
            </Typography>
            <CircularProgress sx={{ mt: 2 }} />
          </>
        ) : (
          <>
            <Typography variant="h6">Logging you in via Google...</Typography>
            <Box sx={{ mt: 3 }}>
              <CircularProgress />
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}
