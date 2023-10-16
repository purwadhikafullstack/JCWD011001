import { Box, Button, Divider, Flex, Stack, Text, Image } from "@chakra-ui/react";
import React from "react";
import Logo from "../../assets/logo_main.png";
import { useNavigate } from "react-router-dom";

const CartLogin = () => {
  const navigate = useNavigate();

  return (
    <Box h={"100vh"} w={"100%"}>
      <Stack>
        <Box w={"800px"} h={"200px"} m={"100px auto"} align={"center"}>
          <Image src={Logo} />
          <Text fontSize={"3xl"} fontFamily={"initial"}>
            Please Login First
          </Text>
          <Text fontSize={"xl"} fontFamily={"initial"}>
            for better shopping
          </Text>
          <Box w={"270px"}></Box>
          <Flex justifyContent={"space-around"} mt={"50px"}>
            <Box>
              <Text>Don't have any account ? </Text>
              <Button
                mt={5}
                variant={"ghost"}
                _hover={{ bgColor: "brand.hover", color: "white" }}
                onClick={() => navigate("/register")}>
                Create One
              </Button>
            </Box>
            <Box bgColor={"black"}>
              <Divider orientation="vertical" />
            </Box>
            <Box>
              <Text>Already have an account ? </Text>
              <Button
                mt={5}
                variant={"ghost"}
                _hover={{ bgColor: "brand.hover", color: "white" }}
                onClick={() => {
                  navigate("/signin");
                }}>
                Sign in
              </Button>
            </Box>
          </Flex>
        </Box>
      </Stack>
    </Box>
  );
};

export default CartLogin;
