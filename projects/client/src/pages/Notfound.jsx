import { Box, Button, Center, Image, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Error from "../assets/error404.png";
const Notfound = () => {
  const navigate = useNavigate();
  return (
    <Center h={"100vh"}>
      <Box display={"flex"} justifyContent={"center"}>
        <Image src={Error} alt={"404"} w={"300px"} pr={"20px"} />
      </Box>
      <Box textAlign="center">
        <Text fontSize="20px" mt="3" mb="2" fontWeight="bold">
          Page Not Found
        </Text>
        <Text color="gray" mb="6">
          We can't seem to find the page you're looking for.
        </Text>
        <Button
          as={"a"}
          display={"inline-flex"}
          fontSize={"sm"}
          fontWeight={700}
          color={"white"}
          bg={"#37630A"}
          rounded={"lg"}
          _hover={{
            bg: "#457811",
          }}
          _active={{
            bg: "#2D5406",
          }}
          onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    </Center>
  );
};

export default Notfound;
