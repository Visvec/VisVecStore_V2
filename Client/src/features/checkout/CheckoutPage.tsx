import { useState } from "react";
import Box from "@mui/material/Box";
import CheckoutStepper from "./CheckoutStepper";
import OrderSummary from "../../app/shared/components/OrderSummary";

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }} // stack on small screens, row on medium+
      gap={2}
      p={{ xs: 2, md: 4 }} // padding varies by screen size
    >
      <Box
        flex={1}
        sx={{
          width: "100%",
        }}
      >
        <CheckoutStepper onStepChange={setActiveStep} />
      </Box>

      {activeStep === 0 && (
        <Box
          flex={1}
          sx={{
            width: "100%",
          }}
        >
          <OrderSummary />
        </Box>
      )}
    </Box>
  );
}
