// src/pages/AboutPage.tsx
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AboutPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>About Us</Typography>

      <Box sx={{ my: 4 }}>
        <Typography variant="body1" sx={{ textAlign: 'justify', marginBottom: 2 }}>
          Founded in 2025, Visvec began with a vision to make essential electronic 
          components more accessible to innovators, students, and creators.
          What started as a passion for technology is evolving into something 
          greater—a dynamic marketplace offering 
          a wide range of quality products that reflect our core values: 
          innovation, sustainability, and community empowerment.
        </Typography>

        <Typography variant="body1" sx={{ textAlign: 'justify', marginBottom: 2 }}>
          At Visvec, we believe shopping should be more than just a transaction. 
          It's an experience built on trust, care, and purpose. 
          That's why we are dedicated to curating products that 
          are not only high-quality and eco-conscious but also support
           local craftsmanship and responsible sourcing.
        </Typography>

        <Typography variant="body1" sx={{ textAlign: 'justify', marginBottom: 2 }}>
         As we grow, so will our catalog—expanding thoughtfully into 
         diverse product lines while keeping our commitment to excellence 
         and sustainability at the heart of everything we do.
        </Typography>
         <Typography variant="body1" sx={{ textAlign: 'justify', marginBottom: 2 }}>
         We're glad you're here. Thank you for being part of the Visvec story. 
         Let's build something meaningful together.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutPage;
