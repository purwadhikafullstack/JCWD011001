import React, { useEffect, useState } from "react";
import { Badge, Box, Flex, Image, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const UserOrderOngoingCard = ({
  item,
  setDetail,
  setTransactionDetail,
  setTransactionProducts,
}) => {
  const orderStatusArray = [
    { status: "Awaiting Payment", color: "red" },
    { status: "Wait for Confirmation", color: "orange" },
    { status: "Processing", color: "orange" },
    { status: "Shipped", color: "green" },
    { status: "Confirm Your Order", color: "green" },
    { status: "Canceled", color: "red" },
    { status: "Finished", color: "Green" },
  ];
  const [products, setProducts] = useState();

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

  const getProduct = async () => {
    try {
      const { data } = await axios.get(`${URL_API}/transaction/${item.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async () => {
    setTransactionDetail(item);
    setTransactionProducts(products);
    await setDetail(true);
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <Flex
      w={{ base: "100%" }}
      border={"1px solid gray"}
      borderRadius={"10px"}
      mb={4}
      p={4}
      justifyContent={{ base: "space-evenly", md: "space-between" }}
      _hover={{ bg: "gray.100", cursor: "pointer" }}
      onClick={handleClick}
    >
      <Box>
        <Text
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight={"semibold"}
          textDecoration={"underline"}
          textTransform={"uppercase"}
        >
          Order#{item.user_id}
          {item.id}
        </Text>
        <Text color={"gray.400"} fontSize={{ base: "sm", md: "md" }}>
          {changeDate(item.createdAt)}
        </Text>
        <Badge
          bg={orderStatusArray[item.status].color}
          fontWeight={"bold"}
          mt={4}
          textColor={"white"}
          borderRadius={"2xl"}
          px={3}
          py={1}
          fontSize={{ base: "9px", md: "md" }}
        >
          {orderStatusArray[item.status].status}
        </Badge>
        {item.message && (
          <Text fontSize={{ base: "sm", md: "md" }}>
            Message: {item.message}
          </Text>
        )}
      </Box>
      <Box ml={"auto"}>
        <Box fontSize={{ base: "sm", md: "md" }}>Total Price Detail</Box>
        <Text fontWeight={"bold"} fontSize={{ base: "sm", md: "md" }}>
          Harga: Rp.{item.total_price},-
        </Text>
        <Text fontWeight={"bold"} fontSize={{ base: "sm", md: "md" }}>
          Harga Ongkir: Rp.{item.delivery_price},-
        </Text>
      </Box>
    </Flex>
  );
};

export default UserOrderOngoingCard;
