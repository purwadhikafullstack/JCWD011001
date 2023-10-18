import { Box, Button, Flex, Icon, Input, Select, Text, Tooltip } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransaction } from "../../redux/reducer/TransactionReducer";
import { AiOutlineShoppingCart } from "react-icons/ai";
import UserOrderOngoingCard from "./UserOrderOngoingCard";
import UserOrderOngoingCardDetails from "./UserOrderOngoingCardDetails";
import { useNavigate } from "react-router-dom";
const UserOrderOngoing = ({ setDetail, detail, index, setIndex }) => {
  const navigate = useNavigate();
  const { transaction } = useSelector((state) => state.TransactionReducer);
  const dispatch = useDispatch();
  const [transactionDetail, setTransactionDetail] = useState({});
  const [transactionProducts, setTransactionProducts] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("desc");

  const handleClearStartDate = () => {
    setStartDate("");
  };
  const handleClearEndDate = () => {
    setEndDate("");
  };

  useEffect(() => {
    dispatch(getTransaction({ index, startDate, endDate, orderBy, order }));
  }, [index, startDate, endDate, orderBy, order, detail]);

  useEffect(() => {
    setIndex(1);
  }, []);

  if (transaction.length === 0) {
    return (
      <>
        <Flex direction={{ base: "column", md: "row" }} gap={4} mb={4}>
          <Flex align="center" mb={{ base: 4, md: 0 }}>
            <Tooltip label="Start Date" aria-label="Start Date">
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </Tooltip>
            {startDate && (
              <Button ml={2} colorScheme="red" size="sm" onClick={handleClearStartDate}>
                Clear
              </Button>
            )}
          </Flex>
          <Flex align="center" mb={{ base: 4, md: 0 }}>
            <Tooltip label="End Date" aria-label="End Date">
              <Input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </Tooltip>
            {endDate && (
              <Button ml={2} colorScheme="red" size="sm" onClick={handleClearEndDate}>
                Clear
              </Button>
            )}
          </Flex>
          <Select value={orderBy} onChange={(e) => setOrderBy(e.target.value)} mb={{ base: 4, md: 0 }}>
            <option value={"id"}>Invoice ID</option>
            <option value={"status"}>Status</option>
          </Select>
          <Button
            colorScheme="green"
            onClick={(e) => {
              setOrder(order === "asc" ? "desc" : "asc");
              setIndex(1);
            }}>
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
          <Button colorScheme="green" mt={4} onClick={() => navigate("/shop")}>
            Place an Order
          </Button>
        </Flex>
      </>
    );
  }

  if (!detail) {
    return (
      <>
        <Flex direction={{ base: "column", md: "row" }} gap={4} mb={4}>
          <Flex align="center" mb={{ base: 4, md: 0 }}>
            <Tooltip label="Start Date" aria-label="Start Date">
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </Tooltip>
            {startDate && (
              <Button ml={2} colorScheme="red" size="sm" onClick={handleClearStartDate}>
                Clear
              </Button>
            )}
          </Flex>
          <Flex align="center" mb={{ base: 4, md: 0 }}>
            <Tooltip label="End Date" aria-label="End Date">
              <Input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </Tooltip>
            {endDate && (
              <Button ml={2} colorScheme="red" size="sm" onClick={handleClearEndDate}>
                Clear
              </Button>
            )}
          </Flex>
          <Select value={orderBy} onChange={(e) => setOrderBy(e.target.value)} mb={{ base: 4, md: 0 }}>
            <option value={"id"}>Invoice ID</option>
            <option value={"status"}>Status</option>
          </Select>
          <Button
            colorScheme="green"
            onClick={(e) => {
              setOrder(order === "asc" ? "desc" : "asc");
              setIndex(1);
            }}>
            {order === "asc" ? "ASC" : "DESC"}
          </Button>
        </Flex>

        {transaction.length > 0 && (
          <Box>
            {transaction.map((item) => (
              <UserOrderOngoingCard
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
      <UserOrderOngoingCardDetails
        transactionDetail={transactionDetail}
        transactionProducts={transactionProducts}
        setDetail={setDetail}
      />
    </Box>
  );
};

export default UserOrderOngoing;
