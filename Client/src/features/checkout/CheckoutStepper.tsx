import { Box, Button, Paper, Step, StepLabel, Stepper } from "@mui/material";
import { useEffect, useState } from "react";
import PaystackCheckout from "../payment/PaystackCheckout";
import ShippingAddressForm from "../payment/ShippingAddressForm";
import Review from "../payment/Review";

const steps = ['Address', 'Payment', 'Review'];

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
    hostel: '',
    landmark: '',
    city: '',
    contact: '',
    region: ''
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    amount: 0,
    email: '',
    phone: '',
    provider: 'MTN',
    reference: ''
  });

  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending'>('pending');

  useEffect(() => {
    onStepChange(activeStep);
  }, [activeStep, onStepChange]);

  const handleNext = () => {
    setActiveStep(step => step + 1);
  };

  const handleBack = () => {
    setActiveStep(step => step - 1);
  };

  const handleAddressSubmit = (address: ShippingAddress) => {
    setShippingAddress(address);
    handleNext();
  };

  const handlePaymentComplete = (status: 'success' | 'failed', details: PaymentDetails) => {
    setPaymentStatus(status);
    setPaymentDetails(details);
    if (status === 'success') {
      handleNext();
    }
  };

  const handleTryAgain = () => {
    setActiveStep(1); // Go back to payment step
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: activeStep === 0 ? 'block' : 'none' }}>
          <ShippingAddressForm onAddressSubmit={handleAddressSubmit} handleNext={function (): void {
            throw new Error("Function not implemented.");
          } } />
        </Box>
        <Box sx={{ display: activeStep === 1 ? 'block' : 'none' }}>
          <PaystackCheckout 
            handleNext={handlePaymentComplete} 
            shippingAddress={shippingAddress}
          /> 
        </Box>
        <Box sx={{ display: activeStep === 2 ? 'block' : 'none' }}>
          <Review
            paymentStatus={paymentStatus}
            shippingAddress={shippingAddress}
            paymentDetails={paymentDetails}
            onTryAgain={handleTryAgain}
          />
        </Box>
      </Box>

      <Box display="flex" paddingTop={2} justifyContent="space-between">
        <Button 
          onClick={handleBack} 
          disabled={activeStep === 0 || activeStep === steps.length - 1}
        >
          Back
        </Button>
        {activeStep !== 0 && activeStep !== 1 && activeStep !== 2 && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleNext}
          >
            {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
          </Button>
        )}
      </Box>
    </Paper>
  );
}
