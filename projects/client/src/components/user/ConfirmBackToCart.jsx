import {
  Box,
  Button,
  Center,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const ConfirmBackToCart = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Center>
            <Text fontSize={"xl"} fontWeight={700}>
              Back to Cart?
            </Text>
          </Center>
        </ModalHeader>
        <ModalBody>
          <Center>
            <Text align={"center"} color={"gray.500"}>
              Go back to your cart without checking out?
            </Text>
          </Center>
        </ModalBody>
        <ModalFooter>
          <Box
            w={"100%"}
            display={"flex"}
            flexDir={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Button
              onClick={onClose}
              w={"80%"}
              color={"white"}
              bg={"brand.main"}
              _hover={{ bg: "brand.hover" }}
              _active={{ bg: "brand.active" }}
            >
              Stay To Checkout
            </Button>
            <Button
              onClick={() => navigate("/cart")}
              mt={4}
              w={"80%"}
              color={"brand.main"}
              bg={"white"}
              border={"1px"}
              borderColor={"brand.main"}
              rounded={"lg"}
              _hover={{ bg: "gray.100" }}
              _active={{ bg: "gray.300" }}
            >
              Back To Cart
            </Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmBackToCart;
