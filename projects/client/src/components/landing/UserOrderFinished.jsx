import { Box, Button, Flex, Icon, Input, Select, Text, Tooltip } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFinshedTransaction } from "../../redux/reducer/TransactionReducer";
import UserOrderFinishedCard from "./UserOrderFinishedCard";
import UserOrderOngoingCardDetails from "./UserOrderOngoingCardDetails";
import UserOrderFinishedCardDetails from "./UserOrderFinishedCardDetails";
import { AiOutlineShoppingCart } from "react-icons/ai";

const UserOrderFinished = ({ setDetail, detail, index, setIndex }) => {
  const { transaction } = useSelector((state) => state.TransactionReducer);
  const dispatch = useDispatch();
  const [transactionDetail, setTransactionDetail] = useState({});
  const [transactionProducts, setTransactionProducts] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");

  const handleClearStartDate = () => {
    setStartDate("");
  };
  const handleClearEndDate = () => {
    setEndDate("");
  };

  useEffect(() => {
    dispatch(getFinshedTransaction({ index, endDate, startDate, orderBy, order }));
  }, [index, endDate, startDate, orderBy, order]);

  if (transaction.length === 0) {
    return (
      <>
        <Flex gap={4}>
          <Flex align="center">
            <Tooltip label="Start Date" aria-label="Start Date">
              <Input type="date" mb={4} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </Tooltip>
            {startDate && (
              <Button ml={2} colorScheme="red" size="sm" onClick={handleClearStartDate}>
                Clear
              </Button>
            )}
          </Flex>
          <Flex align="center">
            <Tooltip label="End Date" aria-label="End Date">
              <Input type="date" mb={4} id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </Tooltip>
            {endDate && (
              <Button ml={2} colorScheme="red" size="sm" onClick={handleClearEndDate}>
                Clear
              </Button>
            )}
          </Flex>
          <Select placeholder="Select Order" value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
            <option value={"id"}>Invoice ID</option>
            <option value={"status"}>Status</option>
          </Select>
          <Button colorScheme="green" onClick={(e) => setOrder(order === "asc" ? "desc" : "asc")}>
            {order === "asc" ? "ASC" : "DESC"}
          </Button>
        </Flex>

        <Flex direction="column" alignItems="center" justifyContent="center" h="100%">
          <Icon as={AiOutlineShoppingCart} boxSize={12} color="gray.400" />
          <Text fontSize="xl" fontWeight="bold" mt={4}>
            No Orders Found
          </Text>
          <Text color="gray.600" mt={2}>
            It looks like you haven't placed any orders yet.
          </Text>
          <Button colorScheme="green" mt={4}>
            Place an Order
          </Button>
        </Flex>
      </>
    );
  }

  if (!detail) {
    return (
      <>
        <Flex gap={4}>
          <Flex align="center">
            <Tooltip label="Start Date" aria-label="Start Date">
              <Input type="date" mb={4} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </Tooltip>
            {startDate && (
              <Button ml={2} colorScheme="red" size="sm" onClick={handleClearStartDate}>
                Clear
              </Button>
            )}
          </Flex>
          <Flex align="center">
            <Tooltip label="End Date" aria-label="End Date">
              <Input type="date" mb={4} id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </Tooltip>
            {endDate && (
              <Button ml={2} colorScheme="red" size="sm" onClick={handleClearEndDate}>
                Clear
              </Button>
            )}
          </Flex>
          <Select placeholder="Select Order" value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
            <option value={"id"}>Invoice ID</option>
            <option value={"status"}>Status</option>
          </Select>
          <Button colorScheme="green" onClick={(e) => setOrder(order === "asc" ? "desc" : "asc")}>
            {order === "asc" ? "ASC" : "DESC"}
          </Button>
        </Flex>

        {transaction.length > 0 && (
          <Box>
            {transaction.map((item) => (
              <UserOrderFinishedCard
                key={item.id}
                item={item}
                setDetail={setDetail}
                setTransactionDetail={setTransactionDetail}
                setTransactionProducts={setTransactionProducts}
              />
            ))}
          </Box>
        )}
      </>
    );
  }
  return (
    <Box>
      <UserOrderFinishedCardDetails transactionDetail={transactionDetail} transactionProducts={transactionProducts} />
    </Box>
  );
};

export default UserOrderFinished;
