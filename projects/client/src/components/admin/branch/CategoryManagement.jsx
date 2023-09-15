import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { IoAddOutline } from "react-icons/io5";
import AddCategory from "./AddCategory";
import CategoryList from "./CategoryList";

const CategoryManagement = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onCreate = () => {
    onOpen();
  };
  return (
    <Box w={"full"} minH={"100vh"}>
      <Box
        h={"62px"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={"#D7F0AA"}
        py={4}
        px={8}
      >
        <Box>
          <Text fontSize={{ base: "xl", lg: "2xl" }} fontWeight={"medium"}>
            Category Management
          </Text>
        </Box>
        <Box>
          <Button
            onClick={onCreate}
            gap={2}
            rounded={"lg"}
            bg={"brand.main"}
            ml={4}
            color={"white"}
            _hover={{ bg: "brand.hover" }}
            _active={{ bg: "brand.active" }}
          >
            <IoAddOutline size={24} />
            Add Category
          </Button>
        </Box>
      </Box>
      <Box w={"full"}><CategoryList /></Box>
      <AddCategory isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </Box>
  );
};

export default CategoryManagement;
