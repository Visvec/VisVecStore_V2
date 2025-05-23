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
      px={4}
      height="400px"
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
        p={8}
        zIndex={2}
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.4)", // semi-transparent dark overlay
          backdropFilter: "blur(2px)",
          borderRadius: "16px",
        }}
      >
        <Typography
          variant="h4"
          color="white"
          fontWeight="bold"
          textAlign="center"
          sx={{ my: 3 }}
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
            mt: 8,
            fontWeight: "bold",
            color: "white",
            borderRadius: "16px",
            px: 8,
            py: 2,
          }}
        >
          Shop Now
        </Button>
      </Box>
    </Box>
  );
}
