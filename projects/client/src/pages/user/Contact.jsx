import { Box } from "@chakra-ui/react";
import React from "react";
import Navbar from "../../components/landing/Navbar";
import Footer from "../../components/landing/Footer";
import ContactContent from "../../components/user/ContactContent";

const Contact = () => {
  return (
    <Box>
      <Navbar />
      <ContactContent />
      <Footer />
    </Box>
  );
};

export default Contact;
