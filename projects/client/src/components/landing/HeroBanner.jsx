import { Box, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'

const HeroBanner = () => {
  return (
    <Box w={"100%"} p={"16px 60px"}>
        <Flex>
            <Box>
                <Text fontSize={"2xl"}>Lorem</Text>
                <Text fontSize={"lg"}>ipsum</Text>
            </Box>
            <Box>
                <Image />
            </Box>
        </Flex>
    </Box>
  )
}

export default HeroBanner