import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Alert, Container, Typography, Box, CircularProgress } from '@mui/material';

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');

  // Get parameters from URL
  const status = searchParams.get('status');
  const userId = searchParams.get('userId');
  const token = searchParams.get('token');

  useEffect(() => {
    // If we have a direct status from the controller redirect
    if (status) {
      if (status === 'success') {
        setConfirmationStatus('success');
        setMessage('Your email has been confirmed successfully!');
      } else if (status === 'failed') {
        setConfirmationStatus('error');
        setMessage('Email confirmation failed. Please check the link or try again.');
      }
      return;
    }

    // If we have userId and token, we need to call the confirmation endpoint
    if (userId && token) {
      confirmEmail(userId, token);
    } else {
      // No valid parameters
      setConfirmationStatus('error');
      setMessage('Invalid confirmation request. Missing required parameters.');
    }
  }, [status, userId, token]);

  const confirmEmail = async (userId: string, token: string) => {
    setIsLoading(true);
    try {
      // Call your backend confirmation endpoint
      const response = await fetch(`/api/account/confirm-email?userId=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setConfirmationStatus('success');
        setMessage('Your email has been confirmed successfully!');
      } else {
        setConfirmationStatus('error');
        setMessage('Email confirmation failed. The link may be expired or invalid.');
      }
    } catch (error) {
      console.error('Error confirming email:', error);
      setConfirmationStatus('error');
      setMessage('An error occurred while confirming your email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverity = (): 'success' | 'error' | 'info' => {
    if (confirmationStatus === 'success') return 'success';
    if (confirmationStatus === 'error') return 'error';
    return 'info';
  };

  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 5, sm: 8, md: 10 }, textAlign: 'center', px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress />
            <Typography variant="body1">Confirming your email...</Typography>
          </Box>
        ) : (
          <>
            <Alert severity={getSeverity()} sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}>
                {message}
              </Typography>
            </Alert>
            {confirmationStatus === 'success' && (
              <Typography variant="body1" sx={{ mt: 3, fontSize: { xs: '1rem', md: '1.2rem' } }}>
                You can now <a href="/login">login</a> to your account.
              </Typography>
            )}
            {confirmationStatus === 'error' && (
              <Typography variant="body1" sx={{ mt: 3, fontSize: { xs: '1rem', md: '1.2rem' } }}>
                Need help? <a href="/contact">Contact support</a> or try <a href="/register">registering again</a>.
              </Typography>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default ConfirmEmail;