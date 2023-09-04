import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import React from "react";
import Hero from "../../assets/hero.png";

const HeroBanner = () => {
  return (
    <Box w={"100%"} py={"40px"} px={{  base:"60px", lg:"100px"}}>
      <Flex
        direction={{ base: "column-reverse", lg: "row" }}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Box
          w={{ base: "100%", lg: "50%" }}
          display={"flex"}
          justifyContent={"flex-start"}
          alignItems={"center"}
        >
          <Box>
            <Heading fontSize={"4xl"} mb={2}>
              Shop Locally, Eat Healthily,
            </Heading>
            <Heading fontSize={"4xl"} mb={8}>
              and Support Your Community
            </Heading>
            <Text fontSize={"lg"} color={"#6e6e6e"}>
              Every meal starts with the right ingredients. Find them in{" "}
              <span style={{ color: "#59981A", fontWeight: "bold" }}>
                GrocerEasy
              </span>
              , your trusted partner for quality groceries.
            </Text>
            <Button
              as={"a"}
              href={"/shop"}
              display={"flex"}
              justifyContent={"center"}
              w={{ base: "100%", lg: "50%" }}
              mt={8}
              rounded={"lg"}
              color={"white"}
              bgColor={"#37630A"}
              _hover={{ bgColor: "#457811" }}
              _active={{ bgColor: "#2D5406" }}
            >
              Shop Now
            </Button>
          </Box>
        </Box>
        <Box
          w={{ base: "100%", lg: "50%" }}
          display={{ base: "none", lg: "flex" }}
          justifyContent={"flex-end"}
          alignItems={"center"}
        >
          <Image src={Hero} h={"400px"} />
        </Box>
      </Flex>
    </Box>
  );
};

export default HeroBanner;
