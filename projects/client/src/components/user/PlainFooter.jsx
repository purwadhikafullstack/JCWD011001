import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import React from "react";
import { Link } from "react-router-dom";
import FooterLogo from "../../assets/logo_footer.png";

const PlainFooter = () => {
  return (
    <Box
      py={{ base: "20px", lg: "32px" }}
      px={{ base: "60px", lg: "100px" }}
      w={"100%"}
      bg={"#fbfbfb"}
      borderTop={1}
      borderStyle={"solid"}
      borderColor={"#D7F0AA"}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justifyContent={{ base: "center", md: "space-between" }}
        alignItems={{ base: "center", md: "unset" }}
        textAlign={{ base: "center", md: "unset" }}
        wrap="wrap"
      >
        <Box mb={{ base: "20px", md: "0" }}>
          <Link to={"/"}>
            <Image src={FooterLogo} h={"42px"} />
          </Link>
          <Text fontSize={"sm"} mt={"4"} color={"gray.500"}>
            © 2023 GrocerEasy
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default PlainFooter;
