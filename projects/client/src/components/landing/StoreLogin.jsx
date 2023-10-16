import { Box, Text } from "@chakra-ui/react";
import React from "react";

const StoreLogin = () => {
  return (
    <Box
      width={{ base: "90%" }}
      mx="auto"
      mt={4}
      padding={{ base: "1rem", sm: "1.5rem", md: "2rem" }}
      borderRadius="8px"
      border="2px dashed #ccc"
      textAlign="center">
      <Text fontSize={{ base: "lg", sm: "xl", md: "2xl" }} fontWeight="bold" mb={2}>
        Please Log In First
      </Text>
      <Text fontSize={{ base: "md", sm: "lg", md: "xl" }} color="gray.600">
        You Need to Login first to shop in our store!
      </Text>
    </Box>
  );
};

export default StoreLogin;
