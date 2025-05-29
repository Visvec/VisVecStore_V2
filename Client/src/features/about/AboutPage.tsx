// src/pages/AboutPage.tsx
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AboutPage: React.FC = () => {
  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        mt: { xs: 2, sm: 4, md: 6 },      // responsive margin top
        px: { xs: 2, sm: 3, md: 0 }       // responsive horizontal padding inside container
      }}
    >
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{ 
          fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },   // responsive font size
          fontWeight: 'bold',
          textAlign: 'center',
          mb: { xs: 3, md: 4 }
        }}
      >
        About Us
      </Typography>

      <Box sx={{ my: { xs: 2, md: 4 } }}>
        {[ 
          `Founded in 2025, Visvec began with a vision to make essential electronic 
          components more accessible to innovators, students, and creators.
          What started as a passion for technology is evolving into something 
          greater—a dynamic marketplace offering 
          a wide range of quality products that reflect our core values: 
          innovation, sustainability, and community empowerment.`,

          `At Visvec, we believe shopping should be more than just a transaction. 
          It's an experience built on trust, care, and purpose. 
          That's why we are dedicated to curating products that 
          are not only high-quality and eco-conscious but also support
          local craftsmanship and responsible sourcing.`,

          `As we grow, so will our catalog—expanding thoughtfully into 
          diverse product lines while keeping our commitment to excellence 
          and sustainability at the heart of everything we do.`,

          `We're glad you're here. Thank you for being part of the Visvec story. 
          Let's build something meaningful together.`
        ].map((paragraph, idx) => (
          <Typography 
            key={idx} 
            variant="body1" 
            sx={{ 
              textAlign: 'justify', 
              mb: { xs: 2, md: 3 },
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              lineHeight: 1.6,
            }}
          >
            {paragraph}
          </Typography>
        ))}
      </Box>
    </Container>
  );
};

export default AboutPage;
