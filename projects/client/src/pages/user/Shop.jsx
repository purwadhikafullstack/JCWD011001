import { Box } from "@chakra-ui/react";
import React from "react";
import Navbar from "../../components/landing/Navbar";
import UserLocation from "../../components/landing/UserLocation";
import Product from "../Product";
import ProductList from "../../components/landing/ProductList";

const Shop = () => {
  return (
    <Box>
      <Navbar />
      <ProductList />
    </Box>
  );
};

export default Shop;
