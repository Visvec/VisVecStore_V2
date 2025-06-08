import { useState } from "react"; // <-- add this import
import { useForm } from "react-hook-form";
import { registerSchema, RegisterSchema } from "../../lib/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

// 🔐 Firebase imports
import { createUserWithEmailAndPassword } from "firebase/auth";

// Backend mutation
import { useRegisterMutation } from "./accountApi";
import { auth } from "../passwordreset/firebase";

export default function RegisterForm() {
  const [registerUser] = useRegisterMutation();
  const navigate = useNavigate();

  // New state for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    mode: "onSubmit",
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      // 🔐 Step 1: Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const firebaseUser = userCredential.user;

      // 🔄 Step 2: Register user in your backend
      await registerUser({
        ...data,
        firebaseUid: firebaseUser.uid, // optional but useful
      }).unwrap();

      // ✅ Success — redirect or show success message
      navigate("/login");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Registration failed";

      if (message.includes("email")) {
        setError("email", { message });
      } else if (message.includes("password")) {
        setError("password", { message });
      } else {
        setError("email", { message });
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 4 }, py: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 3, p: { xs: 2, sm: 4 } }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <LockOutlined sx={{ color: "secondary.main", fontSize: 40, mb: 1 }} />
          <Typography variant="h5" textAlign="center">
            Register
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              mt: 3,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label="Email"
              autoFocus
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              fullWidth
              label="First Name"
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
            <TextField
              fullWidth
              label="Last Name"
              {...register("lastName")}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              {...register("dateOfBirth")}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth?.message}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"} // toggle type here
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"} // toggle type here
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
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
              disabled={isSubmitting}
              fullWidth
              sx={{ py: 1.5 }}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </Button>

            <Typography textAlign="center" variant="body2" mt={2}>
              Already have an account?{" "}
              <Typography
                component={Link}
                to="/login"
                color="primary"
                sx={{ textDecoration: "underline", display: "inline" }}
              >
                Sign in here
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
