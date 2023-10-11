import { Box, Button, Flex, Stack, StackDivider, Table, Text, Th, Thead, Tr, Td, Tbody } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const BranchSalesReportUserDetail = ({ user, setSelectedUser, id, startDateState, endDateState }) => {
  const { startDate, setStartDate } = startDateState;
  const { endDate, setEndDate } = endDateState;
  const [userTransactions, setUserTransactions] = useState([]);
  const handleClearClick = () => {
    setSelectedUser(null);
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

  const fetchUserTransactions = async () => {
    try {
      let query = "?page=1";
      if (startDate) query += `&startDate=${startDate}`;
      if (endDate) query += `&endDate=${endDate}`;
      const { data } = await axios.get(`${URL_API}/report/user/${user.user_id}/${id}/${query}`);
      await setUserTransactions(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserTransactions();
  }, [user, endDate, startDate]);

  const renderUserTransaction = () => {
    return (
      <Table variant="simple" colorScheme="green" mb={20}>
        <Thead>
          <Tr>
            <Th>Order ID</Th>
            <Th>Transaction Price</Th>
            <Th>Delivery Price</Th>
            <Th>Discount</Th>
            <Th>Created At</Th>
          </Tr>
        </Thead>
        <Tbody>
          {userTransactions.map((item, index) => (
            <Tr key={index}>
              <Td>{item.id}</Td>
              <Td>Rp.{item.total_price},-</Td>
              <Td>Rp.{item.delivery_price},-</Td>
              <Td>Rp.{item.total_discount},-</Td>
              <Td>{changeDate(item.createdAt)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  };

  if (!user) return null;
  return (
    <Stack>
      <Flex fontFamily={"montserrat"} mt={10} w={"full"}>
        <Flex gap={{ base: "8px", md: "16px", lg: "24px" }}>
          <Text>Username: {user.User.name || "Hasn't Set"}</Text>
          <Text>Email: {user.User.email || "Hasn't Set"}</Text>
          <Text>Phone: {user.User.phone || "Hasn't Set"}</Text>
        </Flex>
      </Flex>
      <StackDivider borderColor="gray.200" />
      <Flex justifyContent={"space-between"}>
        <Text fontSize={{ sm: "8px", md: "16px", lg: "24px" }}>
          User #{user.user_id} - Total {user.totalTransactions} Transactions
        </Text>
        <Button colorScheme="green" onClick={handleClearClick}>
          Clear
        </Button>
      </Flex>
      <StackDivider borderColor="gray.200" />
      {userTransactions && renderUserTransaction()}
    </Stack>
  );
};

export default BranchSalesReportUserDetail;
