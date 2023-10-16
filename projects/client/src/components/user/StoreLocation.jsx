import { Box, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import { IoLocationOutline, IoTimeOutline } from "react-icons/io5";
import storeData from "../../data/storeData.json";
import StoreImage from "../../assets/store_image.png";

const StoreLocation = () => {
  return (
    <Box>
      <Box
        w={"full"}
        py={"16px"}
        px={{ base: "28px", md: "48px", lg: "100px" }}
      >
        <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight={"medium"}>
          Store
        </Text>
        <Box mt={4} mb={8} display={"flex"} flexDir={"column"} gap={8}>
          {storeData &&
            storeData.map((store) => (
              <Box
                key={store.id}
                bg={"white"}
                display={"flex"}
                alignItems={"center"}
                rounded={"xl"}
                borderWidth={"1px"}
                gap={8}
                px={4}
                py={8}
                boxShadow={"lg"}
              >
                <Image w={"100px"} h={"100px"} src={StoreImage} />
                <Box>
                  <Text mb={2} fontWeight={"bold"} fontSize={"lg"}>
                    {store.name}
                  </Text>
                  <Flex alignItems={"center"} gap={2} mb={2}>
                    <IoLocationOutline
                      size={"20px"}
                      style={{ minWidth: "20px" }}
                    />
                    <Text>{store.address}</Text>
                  </Flex>
                  <Flex alignItems={"center"} gap={2}>
                    <IoTimeOutline size={"20px"} style={{ minWidth: "20px" }} />
                    <Text>{store.working_hours}</Text>
                  </Flex>
                </Box>
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default StoreLocation;
