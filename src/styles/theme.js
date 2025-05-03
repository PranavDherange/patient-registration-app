// src/styles/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: { 
    primary: { main: '#0d6efd' },
    secondary: { main: '#6c757d' },
    background: { default: '#f8f9fa', paper: '#ffffff' },
    text: { primary: '#212529', secondary: '#495057' },
  },
  typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 600 }, h5: { fontWeight: 600 }, h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600, }
  },
  shape: { borderRadius: 8 },
  components: {
    MuiAppBar: { styleOverrides: { root: { backgroundColor: '#ffffff', color: '#212529', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderBottom: '1px solid #dee2e6' }}},
    MuiButton: { styleOverrides: { root: { borderRadius: '6px', padding: '8px 16px' }}},
    MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: '6px' }}}},
    MuiCard: { styleOverrides: { root: { borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}},
    MuiTableHead: { styleOverrides: { root: { backgroundColor: '#f1f3f5', '& .MuiTableCell-root': { fontWeight: 600 } }}},
    MuiTableCell: { styleOverrides: { root: { padding: '12px 16px' }}}
  },
});

export default theme;