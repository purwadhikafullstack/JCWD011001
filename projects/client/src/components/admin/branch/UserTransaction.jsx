import {
  Box,
  Button,
  Select,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userCancel } from "../../../redux/reducer/AuthReducer";

const UserTransaction = () => {
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTransaction, setUserTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/branch/transaction`
      );
      setUser(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const getUserTransaction = async (userId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/branch/user/transaction/${userId}`
      );
      console.log("response", response.data.data);
      setUserTransaction(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (selectedUser) {
      getUserTransaction(selectedUser);
    }
  };
  const handleCancel = (item) => {
    console.log("cancel", item);
    dispatch(userCancel(item));
  };

  return (
    <Box fontFamily={"montserrat"} ml={"48px"} mt={"24px"}>
      <Text fontSize={"32px"}>User Order</Text>
      {user.length > 0 ? (
        <Box>
          <Select
            w={"400px"}
            placeholder="Select Customer"
            id="user_id"
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {user.map((item) => (
              <option key={item.id} value={item.id}>
                {item.username}
              </option>
            ))}
          </Select>
          <Button mt={"10px"} onClick={handleButtonClick}>
            Get User
          </Button>
        </Box>
      ) : (
        <Text>No users available</Text>
      )}

      {isLoading ? (
        <Spinner />
      ) : (
        userTransaction && (
          <Box>
            <TableContainer mt={"10px"} ml={"-30px"}>
              <Table variant="simple" size={"sm"}>
                <TableCaption>User Transaction</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Address</Th>
                    <Th>Total Price</Th>
                    <Th>Courier</Th>
                    <Th isNumeric>Delivery Price</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>{userTransaction.address}</Td>
                    <Td>{userTransaction.total_price}</Td>
                    <Td>{userTransaction.courier}</Td>
                    <Td isNumeric>{userTransaction.delivery_price}</Td>
                    <Td>
                      <Button
                        variant={""}
                        _hover={{ bg: "brand.hover", color: "white" }}
                        onClick={() => handleCancel(userTransaction)}
                      >
                        Cancel
                      </Button>
                    </Td>
                  </Tr>
                </Tbody>
                <Tfoot></Tfoot>
              </Table>
            </TableContainer>
          </Box>
        )
      )}
    </Box>
  );
};

export default UserTransaction;
