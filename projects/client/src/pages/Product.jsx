import { Box } from "@chakra-ui/react";
import React from "react";
import Navbar from "../components/landing/Navbar";
import ProductDetail from "./ProductDetail";

const Product = () => {
  return (
    <Box>
      <Navbar />
      <ProductDetail />
    </Box>
  );
};

export default Product;
