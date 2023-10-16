import { Box } from "@chakra-ui/react";
import React from "react";
import Navbar from "../../components/landing/Navbar";
import UserLocation from "../../components/landing/UserLocation";
import Product from "../Product";
import ProductList from "../../components/landing/ProductList";
import StoreLogin from "../../components/landing/StoreLogin";
import { useSelector } from "react-redux";

const Shop = () => {
  const { store_id, store } = useSelector((state) => state.ProductReducer);
  return (
    <Box>
      <Navbar />
      {!store && <StoreLogin />}
      <ProductList />
    </Box>
  );
};

export default Shop;
