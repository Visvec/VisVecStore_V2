import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import {
  Box,
  Typography,
  TextField,
  Button,
  useTheme,
  Theme,
} from '@mui/material';

const ContactPage = () => {
  const form = useRef<HTMLFormElement | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const theme: Theme = useTheme();

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;

    setIsSending(true);
    setStatusMessage(null);

    emailjs
      .sendForm(
        'service_41qoxv6',
        'template_8iik78g',
        form.current,
        '0ijN9EDcpF0Ol4I_x'
      )
      .then(() => {
        setStatusMessage('Message sent successfully!');
        setIsError(false);
        form.current?.reset();
      })
      .catch(() => {
        setStatusMessage('Failed to send message. Please try again.');
        setIsError(true);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const textFieldCommonSx = {
    backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f5f5f5',
    '& .MuiInputBase-input': {
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.mode === 'dark' ? '#ccc' : '#000',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.mode === 'dark' ? '#777' : '#ccc',
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Typography variant="h5" mb={3}>
        Contact Us
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          flexWrap: 'wrap',
        }}
      >
        {/* Contact Information Box */}
        <Box sx={{ flex: 1, minWidth: '280px' }}>
          <Typography variant="h6" mb={2}>
            Contact Information
          </Typography>
          <TextField
            fullWidth
            label="Phone"
            value="+233556696690 / +233551163918"
            slotProps={{ input: { readOnly: true } }}
            margin="normal"
            sx={textFieldCommonSx}
          />
          <TextField
            fullWidth
            label="Email"
            value="visvec2025@gmail.com"
            slotProps={{ input: { readOnly: true } }}
            margin="normal"
            sx={textFieldCommonSx}
          />
          <TextField
            fullWidth
            label="Working Hours"
            value="Monday to Friday - 9 AM to 5 PM"
            slotProps={{ input: { readOnly: true } }}
            margin="normal"
            sx={textFieldCommonSx}
          />
        </Box>

        {/* Message Form Box */}
        <Box sx={{ flex: 2, minWidth: '320px' }}>
          <Typography variant="h6" mb={1}>
            Send a Message
          </Typography>
          <Typography variant="body2" color="error" fontStyle="italic" mb={2}>
            If your message fails to send, please feel free to reach out to us using the contact details provided on the page.
          </Typography>
          <form ref={form} onSubmit={sendEmail}>
            <TextField
              fullWidth
              name="user_name"
              label="Your Name"
              margin="normal"
              required
              sx={textFieldCommonSx}
            />
            <TextField
              fullWidth
              name="user_email"
              label="Your Email"
              type="email"
              margin="normal"
              required
              sx={textFieldCommonSx}
            />
            <TextField
              fullWidth
              name="location"
              label="Location"
              margin="normal"
              required
              sx={textFieldCommonSx}
            />
            <TextField
              fullWidth
              name="message"
              label="Message"
              multiline
              rows={6}
              margin="normal"
              required
              sx={textFieldCommonSx}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Send'}
            </Button>
          </form>

          {statusMessage && (
            <Typography mt={2} color={isError ? 'error' : 'green'}>
              {statusMessage}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ContactPage;
