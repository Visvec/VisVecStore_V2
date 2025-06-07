import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Container,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ChangePasswordForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !newPassword) {
      setError("Email and new password are required");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/account/update-password`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email, 
          newPassword 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Password must be at least 6 characters with special characters,numbers, an uppercase letter and a lowercase letter: ${response.status}`);
      }

      const responseData = await response.json();
      setSuccess(responseData.message || "Password updated successfully");
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err: unknown) {
      console.error("Password update error:", err);
      
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while updating password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 2, sm: 3, md: 4 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: { xs: 2, sm: 3 },
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 2, sm: 2.5, md: 3 },
            width: "100%",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            textAlign="center"
            mb={{ xs: 1, sm: 2, md: 3 }}
            fontWeight="bold"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" },
              lineHeight: 1.2,
            }}
          >
            Change Password
          </Typography>

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            disabled={loading}
            sx={{
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
              "& .MuiInputLabel-root": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
          />

          <TextField
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            required
            disabled={loading}
            helperText="Password must be at least 6 characters long"
            sx={{
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
              "& .MuiInputLabel-root": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
              "& .MuiFormHelperText-root": {
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                    disabled={loading}
                    size={window.innerWidth < 600 ? "small" : "medium"}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
            disabled={loading}
            sx={{
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
              "& .MuiInputLabel-root": {
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    disabled={loading}
                    size={window.innerWidth < 600 ? "small" : "medium"}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              mt: { xs: 1, sm: 2 },
              py: { xs: 1.2, sm: 1.5, md: 1.8 },
              fontWeight: "bold",
              fontSize: { xs: "0.875rem", sm: "1rem", md: "1.1rem" },
              minHeight: { xs: "44px", sm: "48px", md: "52px" },
              borderRadius: { xs: 1, sm: 1.5 },
            }}
          >
            {loading ? "Updating..." : "Change Password"}
          </Button>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mt: { xs: 1, sm: 2 },
                fontSize: { xs: "0.875rem", sm: "1rem" },
                "& .MuiAlert-message": {
                  fontSize: "inherit",
                },
              }}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mt: { xs: 1, sm: 2 },
                fontSize: { xs: "0.875rem", sm: "1rem" },
                "& .MuiAlert-message": {
                  fontSize: "inherit",
                },
              }}
            >
              {success}
              <br />
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Redirecting to login page...
              </Typography>
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
}