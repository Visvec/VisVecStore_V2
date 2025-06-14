import { useState } from "react"; // <-- add this import
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginSchema } from "../../lib/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLazyUserInfoQuery, useLoginMutation } from "./accountApi";

export default function LoginForm() {
  const [login, { isLoading }] = useLoginMutation();
  const [fetchuserInfo] = useLazyUserInfoQuery();
  const location = useLocation();
  const navigate = useNavigate();

  // New state for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<loginSchema>({
    mode: "onSubmit",
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: loginSchema) => {
    try {
      await login(data).unwrap();
      await fetchuserInfo();
      navigate(location.state?.from || "/catalog");
    } catch (error) {
      const apiError = error as { message?: string; data?: { message?: string } };
      const errorMessage = apiError.data?.message || apiError.message || "Login failed";

      if (
        errorMessage.toLowerCase().includes("email") ||
        errorMessage.toLowerCase().includes("user")
      ) {
        setError("email", { message: errorMessage });
      } else if (errorMessage.toLowerCase().includes("password")) {
        setError("password", { message: errorMessage });
      } else {
        setError("email", { message: errorMessage });
      }
    }
  };

  return (
    <Container
      component={Paper}
      maxWidth="sm"
      sx={{
        borderRadius: 3,
        mt: { xs: 3, sm: 6 },
        px: { xs: 2, sm: 4 },
        py: { xs: 4, sm: 6 },
        boxShadow: 3,
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{
          width: "100%",
          maxWidth: 400,
          mx: "auto",
        }}
      >
        <LockOutlined
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
            fontSize: { xs: "1.5rem", sm: "2rem" },
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Sign in
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          width="100%"
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <TextField
            fullWidth
            label="Email"
            autoFocus
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            size="medium"
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"} // toggle password visibility
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            size="medium"
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
          <Button
            disabled={isSubmitting || isLoading}
            variant="contained"
            type="submit"
            size="large"
            sx={{ py: 1.5, fontWeight: "bold" }}
          >
            {isSubmitting || isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <Typography
            sx={{
              textAlign: "center",
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            <Typography
              component={Link}
              to="/forgot-password"
              color="primary"
              sx={{ display: "inline", fontWeight: "medium", mr: 2 }}
            >
              Forgot Password?
            </Typography>
            Don't have an account?
            <Typography
              component={Link}
              to="/register"
              color="primary"
              sx={{ ml: 1, display: "inline", fontWeight: "medium" }}
            >
              Sign up
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
