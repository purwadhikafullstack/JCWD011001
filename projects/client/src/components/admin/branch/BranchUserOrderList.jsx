import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  FormLabel,
  Icon,
  Input,
  Menu,
  MenuButton,
  MenuList,
  IconButton,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBranchUserOrder } from "../../../redux/reducer/UserOrderReducer";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { OrderPagination } from "../super/OrderPagination";
import UserOrderDetail from "../../admin/UserOrderDetail";
import dateFormatter from "../../../utils/dateFormatter";
import orderStatus from "../../../utils/orderStatus";
import Swal from "sweetalert2";
import { AiOutlineCheck } from "react-icons/ai";
import { BsFillSendCheckFill } from "react-icons/bs";
import {
  approveUserPayment,
  branchSendOrder,
  branchUserCancel,
  branchUserConfirm,
} from "../../../redux/reducer/AdminReducer";
import RejectPaymentMessage from "./RejectPaymentMessage";

const BranchUserOrderList = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenReject,
    onOpen: onOpenReject,
    onClose: onCloseReject,
  } = useDisclosure();
  const { page } = useSelector((state) => state.UserOrderReducer);
  const { branchUserOrder } = useSelector((state) => state.UserOrderReducer);
  const [orderId, setOrderId] = useState(null);
  const [index, setIndex] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("desc");
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const handleOrderDetail = (orderId) => {
    setOrderId(orderId);
    onOpen();
  };

  const handleApprovePayment = (orderId) => {
    setOrderId(orderId);
    dispatch(approveUserPayment(orderId, toast)).then(() => {
      dispatch(
        getBranchUserOrder({ index, startDate, endDate, orderBy, order })
      );
    });
  };

  useEffect(() => {
    dispatch(getBranchUserOrder({ index, startDate, endDate, orderBy, order }));
  }, [index, startDate, endDate, orderBy, order]);

  const handleFilterClick = () => {
    const startDateValue = document.getElementById("startDate").value;
    const endDateValue = document.getElementById("endDate").value;

    setStartDate(startDateValue);
    setEndDate(endDateValue);

    if (startDateValue && endDateValue && startDateValue > endDateValue) {
      toast({
        title: "Error",
        description: "End Date cannot be earlier than Start Date",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const filter = {
      index,
      startDate,
      endDate,
      orderBy,
      order,
    };

    dispatch(getBranchUserOrder(filter));
  };

  const handleClearDate = () => {
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
    dispatch(
      getBranchUserOrder({
        index,
        startDate: "",
        endDate: "",
        orderBy,
        order,
      })
    );
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
      dispatch(
        getBranchUserOrder({ index, startDate, endDate, orderBy, order })
      );
    }
  };
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
      dispatch(
        getBranchUserOrder({ index, startDate, endDate, orderBy, order })
      );
    }
  };
  const buttonSend = async (item) => {
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
      Swal.fire("Approve!", "Order Send.", "success");
      dispatch(
        getBranchUserOrder({ index, startDate, endDate, orderBy, order })
      );
    }
  };
  return (
    <>
      <Accordion allowToggle mb={8}>
        <AccordionItem>
          <AccordionButton _expanded={{ bg: "#E5F2CE" }}>
            <Box as="span" flex="1" textAlign="left">
              <Text fontWeight={"medium"}>Sort</Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Flex alignItems="center" gap={2}>
              <Select
                size={{ base: "sm", md: "md" }}
                placeholder="Select Order"
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
              >
                <option value={"id"}>Invoice ID</option>
                <option value={"status"}>Status</option>
              </Select>
              <Button
                size={{ base: "sm", md: "md" }}
                bg={"brand.main"}
                color="white"
                _hover={{ bg: "brand.hover" }}
                _active={{ bg: "brand.active" }}
                onClick={(e) => {
                  setOrder(order === "asc" ? "desc" : "asc");
                  setIndex(1);
                }}
              >
                {order === "asc" ? "ASC" : "DESC"}
              </Button>
            </Flex>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton _expanded={{ bg: "#E5F2CE" }}>
            <Box as="span" flex="1" textAlign="left">
              <Text fontWeight={"medium"}>Filter</Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Flex wrap={"wrap"} alignItems="flex-end" gap={2}>
              <Box>
                <FormLabel
                  fontSize={{ base: "sm", md: "md" }}
                  htmlFor="startDate"
                >
                  Start Date
                </FormLabel>
                <Input
                  size={{ base: "sm", md: "md" }}
                  type="date"
                  id="startDate"
                />
              </Box>
              <Box>
                <FormLabel
                  fontSize={{ base: "sm", md: "md" }}
                  htmlFor="endDate"
                >
                  End Date
                </FormLabel>
                <Input
                  size={{ base: "sm", md: "md" }}
                  type="date"
                  id="endDate"
                />
              </Box>
              <Box gap={2}>
                <Button
                  size={{ base: "sm", md: "md" }}
                  bg={"brand.main"}
                  color="white"
                  _hover={{ bg: "brand.hover" }}
                  _active={{ bg: "brand.active" }}
                  onClick={handleFilterClick}
                >
                  Filter
                </Button>
                <Button
                  size={{ base: "sm", md: "md" }}
                  ml={2}
                  colorScheme="red"
                  onClick={handleClearDate}
                >
                  Clear
                </Button>
              </Box>
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Box w={"full"} minH={"100vh"}>
        {branchUserOrder.length > 0 ? (
          <Table variant="simple" colorScheme="green">
            <Thead>
              <Tr>
                <Th>Invoice ID</Th>
                {isLargerThan768 && <Th>User</Th>}
                {isLargerThan768 && <Th>Date</Th>}
                <Th>Status</Th>
                <Th>Detail</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {branchUserOrder.map((order) => (
                <Tr key={order.id}>
                  <Td>
                    {order.user_id}
                    {order.id}
                  </Td>
                  {isLargerThan768 && <Td>{order.name}</Td>}
                  {isLargerThan768 && <Td>{dateFormatter(order.createdAt)}</Td>}
                  <Td color={orderStatus[order.status].color}>
                    {orderStatus[order?.status]?.status}
                  </Td>
                  <Td>
                    <Button
                      onClick={() => handleOrderDetail(order.id)}
                      size={"sm"}
                    >
                      Detail
                    </Button>
                  </Td>
                  <Td>
                    {order.status === 0 && (
                      <Box>
                        <Button
                          variant={""}
                          _hover={{ bg: "red", color: "white" }}
                          onClick={() => handleCancel(order)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    )}
                    {order.status === 1 && (
                      <Menu>
                        <MenuButton as={Button} size={"sm"}>
                          <Text>Payment</Text>
                        </MenuButton>
                        <MenuList>
                          <Box
                            display={"flex"}
                            flexDir={"column"}
                            px={4}
                            py={2}
                            gap={4}
                          >
                            <Button
                              onClick={() => handleApprovePayment(order.id)}
                              color={"white"}
                              bg={"brand.main"}
                              _hover={{ bg: "brand.hover" }}
                              _active={{ bg: "brand.active" }}
                              size={"sm"}
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() => {
                                setOrderId(order.id);
                                onOpenReject();
                              }}
                              variant={"outline"}
                              colorScheme="red"
                              size={"sm"}
                            >
                              Reject
                            </Button>
                          </Box>
                        </MenuList>
                      </Menu>
                    )}
                    {order.status === 2 && (
                      <Box>
                        <Menu>
                          <MenuButton as={Button} size={"sm"}>
                            <Text>Option</Text>
                          </MenuButton>
                          <MenuList>
                            <Box
                              display={"flex"}
                              flexDir={"column"}
                              px={4}
                              py={2}
                              gap={4}
                            >
                              <Button
                                onClick={() => buttonSend(order)}
                                color={"white"}
                                bg={"brand.main"}
                                _hover={{ bg: "brand.hover" }}
                                _active={{ bg: "brand.active" }}
                                size={"sm"}
                              >
                                Send
                              </Button>
                              <Button
                                onClick={() => handleCancel(order)}
                                variant={"outline"}
                                colorScheme="red"
                                size={"sm"}
                              >
                                Cancel
                              </Button>
                            </Box>
                          </MenuList>
                        </Menu>
                      </Box>
                    )}
                    {order.status >= 3 && (
                      <Text color={"gray.500"} fontStyle={"italic"}>
                        No action
                      </Text>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Box
            w={"full"}
            flexDir={"column"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Icon
              mt={4}
              as={MdOutlineRemoveShoppingCart}
              boxSize={16}
              color={"gray.400"}
            />
            <Text mt={4} fontSize={"lg"} fontWeight={"medium"}>
              No data found
            </Text>
          </Box>
        )}
        {page > 1 && (
          <OrderPagination page={page} index={index} setIndex={setIndex} />
        )}
        <UserOrderDetail isOpen={isOpen} onClose={onClose} orderId={orderId} />
        <RejectPaymentMessage
          isOpen={isOpenReject}
          onClose={onCloseReject}
          id={orderId}
          index={index}
          startDate={startDate}
          endDate={endDate}
          orderBy={orderBy}
          order={order}
        />
      </Box>
    </>
  );
};

export default BranchUserOrderList;
