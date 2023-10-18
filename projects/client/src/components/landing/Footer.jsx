import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import FooterLogo from "../../assets/logo_footer.png";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToTop();
  }, []);
  return (
    <Box
      py={{ base: "20px", md: "32px" }}
      px={{ base: "28px", md: "48px", lg: "100px" }}
      w={"100%"}
      bg={"#fbfbfb"}
      borderTop={1}
      borderStyle={"solid"}
      borderColor={"#D7F0AA"}
    >
      <Flex justifyContent={"space-between"} wrap="wrap" gap={4}>
        <Box mb={{ base: "20px", md: "0" }}>
          <Text fontWeight={500} mb={4}>
            Guide and Help
          </Text>
          <Link to={"/store"} onClick={scrollToTop}>
            <Text mb={2} _hover={{ color: "#59981A" }}>
              Store
            </Text>
          </Link>
          <Link to={"/frequently-asked-questions"} onClick={scrollToTop}>
            <Text mb={2} _hover={{ color: "#59981A" }}>
              FAQ
            </Text>
          </Link>
          <Link to={"/terms-and-conditions"} onClick={scrollToTop}>
            <Text mb={2} _hover={{ color: "#59981A" }}>
              Terms and Condition
            </Text>
          </Link>
          <Link to={"/privacy-and-policy"} onClick={scrollToTop}>
            <Text mb={2} _hover={{ color: "#59981A" }}>
              Privacy Policy
            </Text>
          </Link>
        </Box>
        <Box mb={{ base: "20px", md: "0" }}>
          <Text fontWeight={500} mb={4}>
            GrocerEasy
          </Text>
          <Link to={"/about"} onClick={scrollToTop}>
            <Text mb={2} _hover={{ color: "#59981A" }}>
              About
            </Text>
          </Link>
          <Link to={"/contact"} onClick={scrollToTop}>
            <Text mb={2} _hover={{ color: "#59981A" }}>
              Contact
            </Text>
          </Link>
          <Link>
            <Text mb={2} _hover={{ color: "#59981A" }}>
              Blog
            </Text>
          </Link>
        </Box>
        <Box mb={{ base: "20px", md: "0" }}>
          <Text fontWeight={500} mb={4}>
            Follow Us
          </Text>
          <Stack direction={"row"} spacing={8}>
            <Link to={"https://twitter.com/"}>
              <FaTwitter size={"24px"} color="#1A202C" />
            </Link>
            <Link to={"https://www.youtube.com/"}>
              <FaYoutube size={"24px"} color="#1A202C" />
            </Link>
            <Link to={"https://www.instagram.com/"}>
              <FaInstagram size={"24px"} color="#1A202C" />
            </Link>
          </Stack>
        </Box>
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

export default Footer;
