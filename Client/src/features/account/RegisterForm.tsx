import { useForm } from "react-hook-form";
import { useRegisterMutation } from "./accountApi";
import { registerSchema, RegisterSchema } from "../../lib/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function RegisterForm() {
  const [registerUser] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isLoading },
  } = useForm<RegisterSchema>({
    mode: "onTouched",
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      await registerUser(data).unwrap();
    } catch (error) {
      const apiError = error as { message: string };
      if (apiError.message && typeof apiError.message === "string") {
        const errorArray = apiError.message.split(",");

        errorArray.forEach((e) => {
          if (e.includes("Password")) {
            setError("password", { message: e });
          } else if (e.includes("Email")) {
            setError("email", { message: e });
          }
        });
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

            {/* Date of Birth using FormControl for better flexibility */}
            <FormControl fullWidth>
              <InputLabel shrink htmlFor="dateOfBirth">
                Date of Birth
              </InputLabel>
              <TextField
                fullWidth
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth?.message}
              />
            </FormControl>

            <TextField
              fullWidth
              label="Password"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !isValid}
              fullWidth
              sx={{ py: 1.5 }}
            >
              Register
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
