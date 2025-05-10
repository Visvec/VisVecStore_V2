import { useState } from "react";
import Box from "@mui/material/Box";
import CheckoutStepper from "./CheckoutStepper";
import OrderSummary from "../../app/shared/components/OrderSummary";

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Box display="flex" flexDirection="row">
      <Box flex={1} sx={{ height: '100%' }}>
        <CheckoutStepper onStepChange={setActiveStep} />
      </Box>
      {activeStep === 0 && (
        <Box flex={1} sx={{ height: '100%' }}>
          <OrderSummary />
        </Box>
      )}
    </Box>
  );
}
