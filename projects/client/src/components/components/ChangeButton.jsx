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
      colorScheme="yellow"
    >
      Change
    </Button>
  );
}

export default ChangeButton