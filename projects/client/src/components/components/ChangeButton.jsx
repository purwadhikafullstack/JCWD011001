import { Button } from '@chakra-ui/react';
import React from 'react'

const ChangeButton = () => {
  return (
    <Button
      ml={"20px"}
      mt={"20px"}
      w={"150px"}
      borderRadius={"50px"}
      type="submit"
      color={"white"}
      bg={"brand.main"}
      _hover={{ bg: "brand.hover" }}
      _active={{ bg: "brand.active" }}
    >
      Change
    </Button>
  );
}

export default ChangeButton