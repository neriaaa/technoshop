import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#09090b',
      paper: '#18181b',
    },
    primary: {
      main: '#00f2fe',
    },
    secondary: {
      main: '#8b5cf6', 
    },
    text: {
      primary: '#f8fafc',
      secondary: '#a1a1aa',
    }
  },
  typography: {
    fontFamily: '"Montserrat", "Inter", "Roboto", sans-serif',
    h3: {
      fontWeight: 900,
      letterSpacing: '-1px',
    },
    h5: {
      fontWeight: 800,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontWeight: 800,
          letterSpacing: '1px',
          borderRadius: '12px',
          padding: '12px 24px',
          transition: 'all 0.3s ease-in-out',
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #00f2fe 0%, #4facfe 100%)',
          color: '#000', 
          boxShadow: '0 4px 20px rgba(0, 242, 254, 0.4)',
          '&:hover': {
            boxShadow: '0 6px 30px rgba(0, 242, 254, 0.7)',
            transform: 'translateY(-2px) scale(1.02)', 
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(24, 24, 27, 0.6)', 
          backdropFilter: 'blur(12px)', 
          border: '1px solid rgba(255, 255, 255, 0.05)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
          '&:hover': {
            border: '1px solid rgba(0, 242, 254, 0.5)', 
            boxShadow: '0 10px 40px -10px rgba(0, 242, 254, 0.3)',
            transform: 'translateY(-12px)', 
          },
        },
      },
    },
  },
});