import { Button } from '@chakra-ui/react';
import React from 'react'

const CloseButton = ({ onClose }) => {
  return (
    <Button
      mt={"20px"}
      w={"150px"}
      borderRadius={"50px"}
      onClick={onClose}
      color={"brand.main"}
      bg={"white"}
      border={"1px"}
      borderColor={"brand.main"}
      _hover={{
        bg: "gray.100",
      }}
      _active={{
        bg: "gray.200",
      }}
    >
      Close
    </Button>
  );
}

export default CloseButton