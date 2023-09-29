import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Text, Card, CardBody } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import axios from "axios";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const ItemCart = ({ products, setTotalWeight, totalWeight }) => {
  console.log(products);

  return (
    <Box>
      <Card mt={"4"} w={"full"} boxShadow={"lg"}>
        <CardBody>
          <Box fontWeight={"bold"} mb={"24px"}>
            <Text>Click and Play</Text>
          </Box>
          <Flex>
            <Image
              src="https://cdn10.bigcommerce.com/s-f70ch/products/106/images/307/18__31743.1449827934.1280.1280.jpg?c=2"
              w={"20%"}
            />
            <Box ml={"32px"}>
              <Text>{products.name}</Text>
              <Text fontWeight={"bold"}>Rp. {products.price}</Text>
            </Box>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
};

export default ItemCart;
