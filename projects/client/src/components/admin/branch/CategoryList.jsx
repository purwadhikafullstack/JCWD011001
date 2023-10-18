import React, { useEffect, useState } from "react";
import { Box, Flex, IconButton, Image, Text, useDisclosure } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../../../redux/reducer/CategoryReducer";
import {
  IoCreateOutline,
  IoTrashOutline,
} from "react-icons/io5";
import getImage from "../../../utils/getImage";
import DeleteCategoryModal from "./DeleteCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

const CategoryList = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.CategoryReducer.category);
  const [categoryId, setCategoryId] = useState(null);
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  return (
    <Box px={8} py={4}>
      <Flex
        alignItems={"center"}
        justifyContent={"flex-start"}
        gap={4}
        wrap={"wrap"}
      >
        {categories.map((category) => (
          <Box
            key={category.id}
            align={"center"}
            bg={"white"}
            rounded={"lg"}
            p={4}
            boxShadow={"lg"}
            w={"200px"}
            borderWidth={"1px"}
          >
            <Image
              src={getImage(category.category_img)}
              alt={category.name}
              w={"100px"}
            />
            <Text mt={8} fontSize={"md"} fontWeight={"medium"}>
              {category.name}
            </Text>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              mt={4}
              w={"full"}
            >
              <IconButton
                variant={"ghost"}
                icon={<IoCreateOutline />}
                aria-label="Edit"
                size={"md"}
                colorScheme="green"
                rounded={"full"}
                onClick={() => {
                  setCategoryId(category.id);
                  onOpenEdit();
                }}
              />
              <IconButton
                variant={"ghost"}
                icon={<IoTrashOutline />}
                aria-label="Delete"
                size={"md"}
                colorScheme="red"
                rounded={"full"}
                onClick={() => {
                  setCategoryId(category.id);
                  onOpenDelete();
                }}
              />
            </Box>
          </Box>
        ))}
      </Flex>
      <DeleteCategoryModal isOpen={isOpenDelete} onClose={onCloseDelete} id={categoryId} />
      <EditCategoryModal isOpen={isOpenEdit} onClose={onCloseEdit} id={categoryId} />
    </Box>
  );
};

export default CategoryList;
