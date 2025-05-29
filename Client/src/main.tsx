import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/layout/styles.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes/Routes.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store/store.ts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f9f9f9',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer
          position="bottom-right"
          hideProgressBar
          theme="colored"
          autoClose={3000}
          style={{ fontSize: '0.875rem', width: '90%', maxWidth: 400 }}
        />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
