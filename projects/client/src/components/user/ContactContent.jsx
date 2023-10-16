import { Box, Text } from '@chakra-ui/react';
import React from 'react'
import { Link } from 'react-router-dom';

const ContactContent = () => {
  return (
    <Box w={"full"} py={"16px"} px={{ base: "28px", md: "48px", lg: "100px" }}>
      <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight={"medium"}>
        Contact Us
      </Text>
      <Box mt={4} mb={8}>
        <Text mb={4}>
          We value your thoughts and inquiries! If you have any questions,
          feedback, or suggestions, don't hesitate to contact us. Our dedicated
          team is here to assist you. Whether you want to discuss a potential
          collaboration, provide feedback on our services, or simply ask a
          question, we are all ears.
        </Text>
        <Text mb={4}>
          Feel free to drop us an email at{" "}
          <Link to="mailto:grocereasy@gmail.com">
            <Text
              as={"span"}
              fontWeight="bold"
              color="#37630A"
              _hover={{ textDecoration: "underline" }}
            >
              grocereasy@gmail.com
            </Text>
          </Link>{" "}
          anytime. We strive to respond promptly and ensure that every message
          is attended to with the utmost care and attention.
        </Text>
        <Text>
          Your input is invaluable to us, and we appreciate the time you take to
          get in touch. Together, let's make our interaction meaningful and
          productive. Thank you for reaching out - we look forward to hearing
          from you!
        </Text>
      </Box>
    </Box>
  );
}

export default ContactContent