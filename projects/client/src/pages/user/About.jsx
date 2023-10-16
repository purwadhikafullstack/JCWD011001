import { Box } from '@chakra-ui/react';
import React from 'react'
import Navbar from '../../components/landing/Navbar';
import Footer from "../../components/landing/Footer";
import AboutContent from '../../components/user/AboutContent';

const About = () => {
  return (
    <Box>
      <Navbar />
      <AboutContent />
      <Footer />
    </Box>
  );
}

export default About