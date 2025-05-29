import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const imageCount = 18;

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev >= imageCount ? 1 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      maxWidth="xl"
      mx="auto"
      px={{ xs: 2, sm: 4, md: 6 }}     // responsive horizontal padding
      height={{ xs: 300, sm: 350, md: 400 }} // responsive height
      position="relative"
      overflow="hidden"
      borderRadius="16px"
    >
      {/* Fade Transition Images */}
      {[...Array(imageCount)].map((_, i) => (
        <img
          key={i}
          src={`/images/hero${i + 1}.jpg`}
          alt={`hero${i + 1}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "16px",
            transition: "opacity 1s ease-in-out",
            opacity: currentImageIndex === i + 1 ? 1 : 0,
            zIndex: currentImageIndex === i + 1 ? 1 : 0,
          }}
        />
      ))}

      {/* Overlay Content with dark background */}
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        p={{ xs: 3, sm: 6, md: 8 }}   // responsive padding
        zIndex={2}
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(2px)",
          borderRadius: "16px",
        }}
      >
        <Typography
          variant="h4"
          color="white"
          fontWeight="bold"
          textAlign="center"
          sx={{ my: { xs: 2, md: 3 }, px: { xs: 1, sm: 2, md: 0 } }}  // margin and padding responsive
        >
          Welcome to Visvec Store!
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/catalog"
          color="primary"
          sx={{
            mt: { xs: 4, sm: 6, md: 8 },
            fontWeight: "bold",
            color: "white",
            borderRadius: "16px",
            px: { xs: 4, sm: 6, md: 8 },  // responsive horizontal padding
            py: { xs: 1.5, sm: 2, md: 2 },
            minWidth: { xs: 'auto', md: 150 } // better sizing on small devices
          }}
        >
          Shop Now
        </Button>
      </Box>
    </Box>
  );
}
