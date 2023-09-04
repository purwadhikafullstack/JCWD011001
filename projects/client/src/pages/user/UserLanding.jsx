import { Box } from "@chakra-ui/react";
import React from "react";
import Navbar from "../../components/landing/Navbar";
import HeroBanner from "../../components/landing/HeroBanner";
import Category from "../../components/landing/Category";
import Footer from "../../components/landing/Footer";
import ProductList from "../../components/landing/ProductList";
import UserLocation from "../../components/landing/UserLocation";

const UserLanding = () => {
  return (
    <Box>
      <Navbar />
      <UserLocation />
      <HeroBanner />
      <Category />
      <ProductList />
      <Footer />
    </Box>
  );
};

export default UserLanding;
