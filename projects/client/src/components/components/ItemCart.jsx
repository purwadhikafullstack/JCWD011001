import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Text, Card, CardBody } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import axios from "axios";
import getImage from "../getImage/getImage";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const ItemCart = ({ products, setTotalWeight, totalWeight }) => {
  // console.log(products);

  return (
    <Box>
      <Card mt={"4"} w={"full"} boxShadow={"lg"}>
        <CardBody>
          <Box fontWeight={"bold"} mb={"24px"}>
            <Text>{products.Store?.name}</Text>
          </Box>
          <Flex>
            <Image src={getImage(products.Product?.product_img)} w={"20%"} />
            <Box ml={"32px"}>
              <Text>{products.name}</Text>
              <Text color={"gray.500"}>Qty: {products.quantity}</Text>
              <Text fontWeight={"bold"}>Rp. {products.price}</Text>
            </Box>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
};

export default ItemCart;
