// src/pages/HomePage.js
import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

function HomePage() {
  return (
    <Grid container spacing={4} alignItems="flex-start">
       <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                Patient Management
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
                Register patients or query records. Data stored locally via Pglite.
            </Typography>
       </Grid>
      <Grid item xs={12} lg={5}>
         // patient form  
      </Grid>
      <Grid item xs={12} lg={7}>
        // Table showing records
      </Grid>
    </Grid>
  );
}

export default HomePage;