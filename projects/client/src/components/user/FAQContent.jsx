import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Text } from '@chakra-ui/react'
import React from 'react'
import FAQData from '../../data/FAQData'

export const FAQContent = () => {
  return (
    <Box w={"full"} py={"16px"} px={{ base: "28px", md: "48px", lg: "100px" }}>
      <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight={"medium"}>
        Frequently Asked Questions
      </Text>
      <Box mt={8} mb={12}>
        <Accordion allowMultiple>
          {FAQData &&
            FAQData.map((item, index) => (
              <AccordionItem key={index}>
                <AccordionButton py={4} _expanded={{ bg: "#E5F2CE" }}>
                  <Box as="span" flex="1" textAlign="left">
                    <Text>{item.question}</Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel py={4}>{item.answer}</AccordionPanel>
              </AccordionItem>
            ))}
        </Accordion>
      </Box>
    </Box>
  );
}
