import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import PrivacyAndPolicyData from '../../data/PrivacyAndPolicyData';

const PrivacyAndPolicyContent = () => {
  return (
    <Box w={"full"} py={"16px"} px={{ base: "28px", md: "48px", lg: "100px" }}>
      <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight={"medium"}>
        Privacy and Policy
      </Text>
      <Box mt={4} mb={8}>
        <Text>
          This Privacy Policy outlines how we collect, use, disclose, and safeguard your personal information when you use our online grocery web app. By accessing or using our services, you consent to the practices described in this Privacy Policy.
        </Text>
        {PrivacyAndPolicyData && PrivacyAndPolicyData.map((item, index) => (
          <Box key={index}>
            <Box mt={8}>
              <Text
                mb={2}
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight={"bold"}
              >
                {item.heading}
              </Text>
              <Text>{item.text}</Text>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default PrivacyAndPolicyContent