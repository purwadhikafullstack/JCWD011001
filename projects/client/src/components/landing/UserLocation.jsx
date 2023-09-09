import React, { useEffect, useState } from "react";
import { Box, Text, Center, Flex, Spinner } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getProduct, getStoreProduct } from "../../redux/reducer/ProductReducer";
const KEY = process.env.REACT_APP_KEY;

const UserLocation = () => {
  const userLocation = useSelector((state) => state.AuthReducer.location);
  const dispatch = useDispatch();
  // console.log(userLocation);

  //ini untuk dapatin lokasi search buat produk dimana
  // const fetchLoc = async () => {
  //   try {
  //     const { data } = await axios.get(
  //       `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
  //         location
  //       )}&key=${KEY}&language=id&roadinfo=1&pretty=1`
  //     );
  //     console.log(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    if (!userLocation) dispatch(getProduct());
    if (userLocation) dispatch(getStoreProduct(userLocation));
  }, [userLocation]);

  return (
    <Box p={4}>
      <Center>
        {userLocation ? (
          <Flex align={"center"}>{<Text fontSize="xl">Lokasi Anda: {userLocation.city}</Text>}</Flex>
        ) : (
          <Spinner size="xs" />
        )}
      </Center>
    </Box>
  );
};

export default UserLocation;
