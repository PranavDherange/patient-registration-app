import React from 'react';
import Box from '@mui/material/Box'; /* ... imports */
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

function Footer() {
  return (
    <Box component="footer" sx={{ py: 2, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[200] }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}{new Date().getFullYear()}{' MedBlocks Patient App Task (@pglite/react Version).'}
        </Typography>
      </Container>
    </Box>
  );
}
export default Footer;