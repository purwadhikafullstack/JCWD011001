import { Box, Image, Text } from '@chakra-ui/react';
import React from 'react'

const CategoryCard = (props) => {
  return (
    <Box
      align={"center"}
      bg={"white"}
      rounded={"3xl"}
      p={8}
      w={"250px"}
      h={"310px"}
      boxShadow={"lg"}
      _hover={{ transform: "scale(1.03)", transition: "300ms" }}
    >
      <Image src={props.src} w={"90%"} />
      <Text mt={8} fontSize={"xl"} fontWeight={"medium"}>
        {props.name}
      </Text>
    </Box>
  );
}

export default CategoryCard