import { Box, Image, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getCategory } from "../../redux/reducer/CategoryReducer";
import getImage from "../../utils/getImage";

const CategoryCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category } = useSelector((state) => state.CategoryReducer);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  return (
    <>
      {category && category.map((category) => (
        <Box
        onClick={() => {
          navigate(`/category/${category.id}`);
        }}
          key={category.id}
          align={"center"}
          bg={"white"}
          rounded={"2xl"}
          w={"250px"}
          h={"280px"}
          p={8}
          boxShadow={"lg"}
          _hover={{ transform: "scale(1.03)", transition: "300ms", cursor: "pointer" }}
        >
          <Image src={getImage(category.category_img)} alt={category.name} w={"80%"} />
          <Text mt={8} fontSize={"xl"} fontWeight={"medium"}>
            {category.name}
          </Text>
        </Box>
      ))}
    </>
  );
};

export default CategoryCard;
