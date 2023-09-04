import { Box, Center, Heading, Text } from '@chakra-ui/react'
import React from 'react'

const ProductList = () => {
  return (
    <Box w={"100%"} py={"40px"} px={{ base: "60px", lg: "100px" }}>
      <Box mb={10}>
        <Center>
          <Heading as={"h2"}>Products</Heading>
        </Center>
      </Box>
      <Box>
        <Text>Coming Soon</Text>
      </Box>
    </Box>
  );
}

export default ProductList