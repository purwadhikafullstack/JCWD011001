import { Box, Icon, Text } from '@chakra-ui/react';
import React from 'react'

const MenuDashboard = (props) => {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"flex-start"}
      p={"4"}
      bg={"#37630A"}
      _hover={{ bg: "#457811" }}
    >
      <Icon as={props.icon} w={{ base: 4, md: 6 }} h={{ base: 4, md: 6 }} />
      <Text fontSize={{ base: "lg", md: "18" }} fontWeight="bold" ml={2}>
        {props.name}
      </Text>
    </Box>
  );
}

export default MenuDashboard