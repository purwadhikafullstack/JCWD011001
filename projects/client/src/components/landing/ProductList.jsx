import { Box, Center, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductListItem from "./ProductListItem";
import { Pagination } from "../components/Pagination";
import { getProduct, getStoreProduct } from "../../redux/reducer/ProductReducer";

const ProductList = () => {
  const products = useSelector((state) => state.ProductReducer.product);
  const { location, lon, lat } = useSelector((state) => state.AuthReducer);
  const { page } = useSelector((state) => state.ProductReducer);
  const [index, setIndex] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location) dispatch(getProduct({ index }));
    if (location) dispatch(getStoreProduct({ location, lon, lat, index }));
  }, [index, location]);

  if (products.length < 1) {
    return (
      <Center h={"30vh"}>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box w={"100%"} py={"40px"} px={{ base: "60px", lg: "100px" }}>
      <Box mb={10}>
        <Center>
          <Heading as={"h2"}>Products</Heading>
        </Center>
      </Box>
      <Flex gap={{ base: 4, md: 8 }} w={"80%"} justifyContent={"center"}>
        {products.map((product) => (
          <ProductListItem product={product} key={product.id} />
        ))}
      </Flex>
      <Pagination page={page} index={index} setIndex={setIndex} />
    </Box>
  );
};

export default ProductList;
