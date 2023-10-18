import { Table, Thead, Tbody, Tr, Th, Td, Box, Center, Skeleton, Stack, Flex, Text, Icon } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiOutlineInbox } from "react-icons/ai";
import axios from "axios";
import BranchSalesReportUserDetail from "./BranchSalesReportUserDetail";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const BranchSalesReportUser = ({ id, orderState, startDateState, endDateState }) => {
  const [users, setUsers] = useState([]);
  const { order, setOrder } = orderState;
  const { startDate, setStartDate } = startDateState;
  const { endDate, setEndDate } = endDateState;
  const [selectedUser, setSelectedUser] = useState(null);

  const handleRowClick = (user) => {
    setSelectedUser(user);
  };

  const fetchUsers = async () => {
    try {
      let query = "";
      if (startDate) query += `&startDate=${startDate}`;
      if (endDate) query += `&endDate=${endDate}`;
      const { data } = await axios.get(`${URL_API}/report/user/${id}?order=${order}${query}`);
      setUsers(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [id, order, startDate, endDate]);

  if (users.length === 0) {
    return (
      <Box
        width={{ base: "90%", sm: "70%", md: "50%" }}
        mx="auto"
        mt={4}
        padding={{ base: "1rem", sm: "1.5rem", md: "2rem" }}
        borderRadius="8px"
        border="2px dashed #ccc"
        textAlign="center">
        <Box mb={4}>
          <Icon as={AiOutlineInbox} boxSize={8} />
        </Box>
        <Text fontSize={{ base: "lg", sm: "xl", md: "2xl" }} fontWeight="bold" mb={2}>
          Sorry, there are no transactions yet.
        </Text>
        <Text fontSize={{ base: "md", sm: "lg", md: "xl" }} color="gray.600">
          It looks like your user haven't made any transactions.
        </Text>
      </Box>
    );
  }

  return (
    <Stack>
      <Center w={"100%"} mt={"24px"}>
        <Table variant="simple" colorScheme="green">
          <Thead>
            <Tr>
              <Th>User ID</Th>
              <Th>Total Finished Transactions</Th>
              <Th>Total Money Spent</Th>
              <Th>Total Discount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((item, index) => (
              <Tr key={index} _hover={{ bg: "gray.100" }} cursor={"pointer"} onClick={() => handleRowClick(item)}>
                <Td>{item.user_id}</Td>
                <Td>{item.totalTransactions}</Td>
                <Td>Rp.{item.total_price},-</Td>
                <Td>Rp.{item.total_discount},-</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Center>
      {selectedUser && (
        <BranchSalesReportUserDetail
          user={selectedUser}
          setSelectedUser={setSelectedUser}
          id={id}
          startDateState={startDateState}
          endDateState={endDateState}
        />
      )}
    </Stack>
  );
};

export default BranchSalesReportUser;
