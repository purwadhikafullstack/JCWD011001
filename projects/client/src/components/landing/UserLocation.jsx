import React, { useEffect, useState } from "react";
import { Box, Text, Center, Flex, Spinner } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getProduct, getStoreProduct } from "../../redux/reducer/ProductReducer";
const KEY = process.env.REACT_APP_KEY;

const UserLocation = () => {
  const { location, lon, lat } = useSelector((state) => state.AuthReducer);
  const dispatch = useDispatch();

  return (
    <Box p={4}>
      <Center>
        {location ? (
          <Flex align={"center"}>{<Text fontSize="xl">Lokasi Anda: {location.state}</Text>}</Flex>
        ) : (
          <Spinner size="xs" />
        )}
      </Center>
    </Box>
  );
};

export default UserLocation;
