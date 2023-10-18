import { Box, Text } from "@chakra-ui/react";
import React from "react";
import TermsAndConditionsData from "../../data/TermsAndConditionsData";

const TermsAndConditionsContent = () => {
  return (
    <Box w={"full"} py={"16px"} px={{ base: "28px", md: "48px", lg: "100px" }}>
      <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight={"medium"}>
        Terms and Conditions
      </Text>
      <Box mt={4} mb={8}>
        <Text>
          Welcome to our online grocery shopping service! Before you start using our web app, please carefully read these terms and conditions of use. By using this web app, you are deemed to have read, understood, and agreed to all the terms and conditions outlined below.
        </Text>
        {TermsAndConditionsData &&
          TermsAndConditionsData.map((item, index) => (
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
};

export default TermsAndConditionsContent;
