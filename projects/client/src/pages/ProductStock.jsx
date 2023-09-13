import { Box, Center, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { MdStorefront } from "react-icons/md";

const ProductStock = ({ product }) => {
  console.log(product);
  return (
    <Center flexDirection={"column"}>
      <MdStorefront size={50} />
      <Text>{product.Store.name}</Text>
    </Center>
  );
};

export default ProductStock;
