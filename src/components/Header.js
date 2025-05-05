import React from 'react';
import AppBar from '@mui/material/AppBar'; /* ... imports */
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

function Header() {
  return (
    <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar>
         <LocalHospitalIcon sx={{ mr: 1.5, color: 'primary.main' }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          MedBlocks Patient Registry (@pglite/react)
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
export default Header;