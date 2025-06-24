import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import PaystackCheckout from "../payment/PaystackCheckout";
import ShippingAddressForm from "../payment/ShippingAddressForm";
import Review from "../payment/Review";

const steps = ["Address", "Payment", "Review"];

export type ShippingAddress = {
  hostel: string;
  landmark: string;
  city: string;
  contact: string;
  region: string;
};

export type PaymentDetails = {
  amount: number;
  email: string;
  phone: string;
  provider: string;
  reference?: string;
};

interface CheckoutStepperProps {
  onStepChange: (step: number) => void;
}

export default function CheckoutStepper({ onStepChange }: CheckoutStepperProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    hostel: "",
    landmark: "",
    city: "",
    contact: "",
    region: "",
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    amount: 0,
    email: "",
    phone: "",
    provider: "MTN",
    reference: "",
  });

  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | "pending">("pending");

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    onStepChange(activeStep);
  }, [activeStep, onStepChange]);

  const handleNext = () => {
    setActiveStep((step) => step + 1);
  };

  const handleBack = () => {
    setActiveStep((step) => step - 1);
  };

  const handleAddressSubmit = (address: ShippingAddress) => {
    setShippingAddress(address);
    handleNext();
  };

  const handlePaymentComplete = (status: "success" | "failed", details: PaymentDetails) => {
    setPaymentStatus(status);
    setPaymentDetails(details);
    if (status === "success") {
      handleNext();
    }
  };

  const handleTryAgain = () => {
    setActiveStep(1); // Go back to Payment step
    setPaymentStatus("pending");
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        maxWidth: 600,
        mx: "auto",
      }}
    >
      <Stepper
        activeStep={activeStep}
        orientation={isSmDown ? "vertical" : "horizontal"}
        sx={{ mb: 3 }}
      >
        {steps.map((label, index) => (
          <Step key={index} completed={activeStep > index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ minHeight: 300 }}>
        {activeStep === 0 && (
          <ShippingAddressForm onAddressSubmit={handleAddressSubmit} />
        )}
        {activeStep === 1 && (
          <PaystackCheckout
            handleNext={handlePaymentComplete}
            shippingAddress={shippingAddress}
          />
        )}
        {activeStep === 2 && (
          <Review
            paymentStatus={paymentStatus}
            shippingAddress={shippingAddress}
            paymentDetails={paymentDetails}
            onTryAgain={handleTryAgain}
          />
        )}
      </Box>

      <Box
        display="flex"
        flexDirection={isSmDown ? "column" : "row"}
        justifyContent="space-between"
        gap={isSmDown ? 1 : 0}
        pt={2}
      >
        <Button
          onClick={handleBack}
          disabled={activeStep === 0 || paymentStatus === "success"}
          fullWidth={isSmDown}
          variant="outlined"
        >
          Back
        </Button>
      </Box>
    </Paper>
  );
}
