import { Box } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Navbar from "../../components/landing/Navbar";
import HeroBanner from "../../components/landing/HeroBanner";
import Category from "../../components/landing/Category";
import Footer from "../../components/landing/Footer";
import ProductList from "../../components/landing/ProductList";
import UserLocation from "../../components/landing/UserLocation";
import { getProduct, getStoreProduct } from "../../redux/reducer/ProductReducer";
import { useDispatch, useSelector } from "react-redux";

const UserLanding = () => {
  const dispatch = useDispatch();
  const { location, lon, lat } = useSelector((state) => state.AuthReducer);

  useEffect(() => {
    if (!location) dispatch(getProduct({}));
    if (location) dispatch(getStoreProduct({ location, lon, lat }));
  }, [location]);

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
