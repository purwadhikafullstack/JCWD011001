import React, { useEffect, useState } from "react";
import { Box, Text, Center, Flex, Spinner } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  getProduct,
  getStoreProduct,
} from "../../redux/reducer/ProductReducer";
import { IoLocationOutline } from "react-icons/io5";
const KEY = process.env.REACT_APP_KEY;

const UserLocation = () => {
  const { location } = useSelector((state) => state.AuthReducer);

  return (
    <Box
      py={2}
      px={{ base: "28px", md: "48px", lg: "100px" }}
    >
      {location ? (
        <Flex alignItems={"center"} justifyContent={{ base: "flex-start", md: "center" }} gap={2}>
          <IoLocationOutline />
          <Text>
            Your Location: {location.state}
          </Text>
        </Flex>
      ) : (
        <Spinner size="xs" />
      )}
    </Box>
  );
};

export default UserLocation;
