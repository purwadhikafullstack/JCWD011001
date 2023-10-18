import React from 'react'
import Navbar from '../../components/landing/Navbar';
import { Box } from '@chakra-ui/react';
import Footer from '../../components/landing/Footer';
import StoreLocation from '../../components/user/StoreLocation';


const Store = () => {
  return (
    <Box>
      <Navbar />
      <StoreLocation />
      <Footer />
    </Box>
  );
}

export default Store