import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Text, Tooltip, Flex, Button, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";

const StockManagementHistoryDetail = ({ history, setStartDate, setEndDate, startDate, endDate, page }) => {
  const handleClearStartDate = () => {
    setStartDate("");
  };
  const handleClearEndDate = () => {
    setEndDate("");
  };

  const changeDate = (createdAt) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const dateObject = new Date(createdAt);
    const year = dateObject.getFullYear();
    const monthIndex = dateObject.getMonth();
    const date = dateObject.getDate();
    const monthName = monthNames[monthIndex];
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${date}-${monthName}-${year}, ${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p="4" boxShadow="lg" mt={4}>
      <Flex justifyContent={"space-between"}>
        <Heading as="h2" size="lg" mb="4">
          Stock History
        </Heading>
        <Flex gap={4} alignItems={"center"}>
          <Flex align="center">
            <Tooltip label="Start Date" aria-label="Start Date">
              <Input type="date" mb={4} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </Tooltip>

            {startDate && (
              <Button ml={2} mb={4} colorScheme="red" size="sm" onClick={handleClearStartDate}>
                Clear
              </Button>
            )}
          </Flex>
          <Text mb={4}>to</Text>
          <Flex align="center">
            <Tooltip label="End Date" aria-label="End Date">
              <Input type="date" mb={4} id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </Tooltip>
            {endDate && (
              <Button ml={2} mb={4} colorScheme="red" size="sm" onClick={handleClearEndDate}>
                Clear
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>No</Th>
            <Th>Date</Th>
            <Th>Quantity</Th>
          </Tr>
        </Thead>
        <Tbody>
          {history.map((item, index) => (
            <Tr key={index}>
              <Td>{index + 1}</Td>
              <Td>{changeDate(item.createdAt)}</Td>
              <Td>{item.quantity}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default StockManagementHistoryDetail;
