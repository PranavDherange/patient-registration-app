import React from 'react';
import { Outlet } from 'react-router-dom'; /* ... imports */
import Box from '@mui/material/Box';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Container from '@mui/material/Container';

function MainLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
}
export default MainLayout;