import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563eb' },
    background: {
      default: '#f4f6f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#172033',
      secondary: '#64748b',
    },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: 'Inter, Segoe UI, Roboto, Arial, sans-serif',
    fontSize: 13,
    h5: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 0,
          fontSize: 13,
        },
        columnHeaders: {
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
        },
        cell: {
          borderColor: '#edf2f7',
        },
      },
    },
  },
})
