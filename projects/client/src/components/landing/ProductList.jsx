import { Box, Center, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductListItem from "./ProductListItem";
import { Pagination } from "../components/Pagination";

const ProductList = () => {
  const products = useSelector((state) => state.ProductReducer.product);
  const [index, setIndex] = useState(1);
  const { page } = useSelector((state) => state.ProductReducer);

  useEffect(() => {}, [index]);

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
      <Pagination
      // page={page} index={index} setIndex={setIndex}
      />
    </Box>
  );
};

export default ProductList;
