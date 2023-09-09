import { Box, Center, Heading, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";

const ProductList = () => {
  const products = useSelector((state) => state.ProductReducer.product);
  console.log(products);

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
      <Box>
        {products.map((product) => (
          <Box>
            {product.Product.name} harga: {product.Product.price}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ProductList;
