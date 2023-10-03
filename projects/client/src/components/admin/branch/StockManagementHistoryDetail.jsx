import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import React from "react";

const StockManagementHistoryDetail = ({ history }) => {
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
      <Heading as="h2" size="lg" mb="4">
        Stock History
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Quantity</Th>
            <Th>History</Th>
          </Tr>
        </Thead>
        <Tbody>
          {history.map((item, index) => (
            <Tr key={index}>
              <Td>{changeDate(item.createdAt)}</Td>
              <Td>{item.quantity}</Td>
              <Td>
                {index + 1 < history.length ? (item.quantity < history[index + 1].quantity ? "Bought" : "Added") : ""}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default StockManagementHistoryDetail;
