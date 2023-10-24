import {
  Box,
  Button,
  IconButton,
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
import {
  branchSendOrder,
  branchUserCancel,
  branchUserConfirm,
} from "../../../redux/reducer/AdminReducer";
import Swal from "sweetalert2";
import { AiOutlineCheck } from "react-icons/ai";
import { BsFillSendCheckFill } from "react-icons/bs";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const OrderUser = () => {
  const [render, setRender] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const dispatch = useDispatch();

  const getAllTransaction = async () => {
    try {
      const response = await axios.get(`${URL_API}/admin/branch/transaction`);
      setAllTransaction(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTransaction();
  }, [render]);

  // const handleButtonClick = () => {
  //   getAllTransaction();
  // };
  const buttonConfirm = async (item) => {
    // dispatch(userCancel(item));
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm order!",
    });
    if (result.isConfirmed) {
      dispatch(branchUserConfirm(item));
      Swal.fire("Cancel!", "Order Confirm.", "success");
      setRender(true);
      getAllTransaction();
    }
  };
  const handleCancel = async (item) => {
    // dispatch(userCancel(item));
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel order!",
    });
    if (result.isConfirmed) {
      dispatch(branchUserCancel(item));
      Swal.fire("Cancel!", "The product has been canceled.", "success");
      setRender(true);
      getAllTransaction();
    }
  };
  const buttonSend = async (item) => {
    // dispatch(userCancel(item));
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send order!",
    });
    if (result.isConfirmed) {
      dispatch(branchSendOrder(item));
      Swal.fire("Cancel!", "Order Confirm.", "success");
      setRender(true);
      getAllTransaction();
    }
  };
  return (
    <Box ml={"48px"} mt={{ base: "12px", lg: "24px" }}>
      <Text fontSize={"32px"}>User Order</Text>
      <TableContainer
        mt={"10px"}
        ml={"-40px"}
        // w={{ base: "600px", lg: "100%" }}
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Address</Th>
              <Th>Total Price</Th>
              <Th>Courier</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {allTransaction.map((item) => (
              <Tr key={item.id}>
                <Td fontSize={"10px"}>{item.User?.username}</Td>
                {/* <Td fontSize={"12px"}>{item.address}</Td> */}
                <Td
                  fontSize={{ base: "12px", md: "12px", lg: "12px" }}
                  maxW={{ base: "120px", md: "150px", lg: "320px" }}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {item.address}
                </Td>

                <Td fontSize={"12px"}>{item.total_price}</Td>
                <Td textTransform={"uppercase"}>{item.courier}</Td>
                <Td textColor={item.status === 5 ? "red" : "green"}>
                  {item.status === 0
                    ? "Waiting Payment"
                    : item.status === 5
                    ? "Canceled"
                    : item.status === 1
                    ? "Admin Confirmation"
                    : item.status === 2
                    ? "Order Process"
                    : item.status === 3
                    ? "Order Shipped"
                    : item.status === 4
                    ? "Order Arrived"
                    : item.status === 6
                    ? "Order Confirm"
                    : null}
                </Td>
                <Td>
                  {item.status === 0 ? (
                    <Box>
                      <Button
                        variant={""}
                        _hover={{ bg: "red", color: "white" }}
                        onClick={() => handleCancel(item)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  ) : item.status === 2 ? (
                    <Box>
                      <Button
                        variant={""}
                        _hover={{ bg: "red", color: "white" }}
                        onClick={() => handleCancel(item)}
                      >
                        Cancel
                      </Button>
                      <IconButton
                        onClick={() => buttonSend(item)}
                        variant={""}
                        borderRadius={"30px"}
                        _hover={{ bg: "brand.hover", color: "white" }}
                        icon={<BsFillSendCheckFill />}
                      />
                    </Box>
                  ) : item.status === 1 ? (
                    <Box>
                      <Button
                        variant={""}
                        _hover={{ bg: "red", color: "white" }}
                        onClick={() => handleCancel(item)}
                      >
                        Cancel
                      </Button>
                      <IconButton
                        onClick={() => buttonConfirm(item)}
                        variant={""}
                        borderRadius={"30px"}
                        _hover={{ bg: "brand.hover", color: "white" }}
                        icon={<AiOutlineCheck />}
                      />
                    </Box>
                  ) : item.status === 3 ? (
                    <Box>
                      <Text>AMAN</Text>
                      {/* <Button
                        variant={""}
                        _hover={{ bg: "red", color: "white" }}
                        onClick={() => handleCancel(item)}
                      >
                        Cancel
                      </Button>
                      <IconButton
                        variant={""}
                        borderRadius={"30px"}
                        _hover={{ bg: "brand.hover", color: "white" }}
                        icon={<AiOutlineCheck />}
                      /> */}
                    </Box>
                  ) : (
                    ""
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot></Tfoot>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrderUser;
