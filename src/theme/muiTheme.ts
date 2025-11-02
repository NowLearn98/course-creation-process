import { createTheme } from '@mui/material/styles';

// Convert HSL to RGB for MUI
const hslToRgb = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return `rgb(${Math.round(255 * f(0))}, ${Math.round(255 * f(8))}, ${Math.round(255 * f(4))})`;
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: hslToRgb(220, 100, 50),
      light: hslToRgb(220, 100, 70),
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: hslToRgb(0, 0, 96),
      contrastText: hslToRgb(0, 0, 10),
    },
    success: {
      main: hslToRgb(142, 76, 36),
      contrastText: '#FFFFFF',
    },
    warning: {
      main: hslToRgb(38, 92, 50),
      contrastText: '#FFFFFF',
    },
    error: {
      main: hslToRgb(0, 84, 60),
      contrastText: '#FFFFFF',
    },
    background: {
      default: hslToRgb(0, 0, 100),
      paper: hslToRgb(0, 0, 100),
    },
    text: {
      primary: hslToRgb(0, 0, 0),
      secondary: hslToRgb(0, 0, 46),
    },
  },
  typography: {
    fontFamily: 'inherit',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 2px 8px rgba(0, 90, 255, 0.08)',
    '0 4px 12px rgba(0, 90, 255, 0.12)',
    '0 8px 24px rgba(0, 90, 255, 0.16)',
    '0 2px 8px rgba(0, 90, 255, 0.08)',
    '0 4px 12px rgba(0, 90, 255, 0.12)',
    '0 8px 24px rgba(0, 90, 255, 0.16)',
    '0 2px 8px rgba(0, 90, 255, 0.08)',
    '0 4px 12px rgba(0, 90, 255, 0.12)',
    '0 8px 24px rgba(0, 90, 255, 0.16)',
    '0 2px 8px rgba(0, 90, 255, 0.08)',
    '0 4px 12px rgba(0, 90, 255, 0.12)',
    '0 8px 24px rgba(0, 90, 255, 0.16)',
    '0 2px 8px rgba(0, 90, 255, 0.08)',
    '0 4px 12px rgba(0, 90, 255, 0.12)',
    '0 8px 24px rgba(0, 90, 255, 0.16)',
    '0 2px 8px rgba(0, 90, 255, 0.08)',
    '0 4px 12px rgba(0, 90, 255, 0.12)',
    '0 8px 24px rgba(0, 90, 255, 0.16)',
    '0 2px 8px rgba(0, 90, 255, 0.08)',
    '0 4px 12px rgba(0, 90, 255, 0.12)',
    '0 8px 24px rgba(0, 90, 255, 0.16)',
    '0 2px 8px rgba(0, 90, 255, 0.08)',
    '0 4px 12px rgba(0, 90, 255, 0.12)',
    '0 8px 24px rgba(0, 90, 255, 0.16)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
