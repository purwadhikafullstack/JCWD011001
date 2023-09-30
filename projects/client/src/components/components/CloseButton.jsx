import { Button } from '@chakra-ui/react';
import React from 'react'

const CloseButton = ({ onClose }) => {
  return (
    <Button
      mt={"20px"}
      w={"150px"}
      borderRadius={"50px"}
      onClick={onClose}
      colorScheme="red"
    >
      Close
    </Button>
  );
}

export default CloseButton