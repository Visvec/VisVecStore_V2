// src/features/account/ForgotPassword.tsx
import { sendPasswordResetEmail } from "firebase/auth";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { LockResetOutlined } from "@mui/icons-material";
import { useState } from "react";
import { auth } from "./firebase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordReset = async () => {
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Check your inbox.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error sending reset email.");
      } else {
        setError("Error sending reset email.");
      }
    }
  };

  return (
    <Container
      component={Paper}
      maxWidth="sm"
      sx={{
        borderRadius: 3,
        mt: { xs: 4, sm: 6 },
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 4, sm: 6 },
        boxShadow: 3,
        mx: "auto",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: 400 },
          mx: "auto",
        }}
      >
        <LockResetOutlined
          sx={{
            mb: 2,
            color: "secondary.main",
            fontSize: { xs: 40, sm: 50 },
          }}
        />
        <Typography
          variant="h5"
          component="h1"
          sx={{
            mb: 3,
            fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2rem" },
            fontWeight: "bold",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          Forgot your password?
        </Typography>

        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handlePasswordReset();
          }}
          width="100%"
          display="flex"
          flexDirection="column"
          gap={2.5}
        >
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error}
            helperText={error || ""}
            size="medium"
          />

          <Button
            variant="contained"
            type="submit"
            size="large"
            sx={{
              py: 1.5,
              fontWeight: "bold",
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
            fullWidth
          >
            Send Reset Link
          </Button>

          {message && (
            <Typography
              color="success.main"
              sx={{
                textAlign: "center",
                fontSize: { xs: "0.9rem", sm: "1rem" },
                mt: 1,
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}
