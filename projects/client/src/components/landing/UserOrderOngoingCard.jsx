import React, { useEffect, useState } from "react";
import { Badge, Box, Flex, Image, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const UserOrderOngoingCard = ({ item, setDetail, setTransactionDetail, setTransactionProducts }) => {
  const orderStatusArray = [
    { status: "Awaiting Payment", color: "red" },
    { status: "Waiting for Payment Confirmation", color: "orange" },
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

  const handleClick = () => {
    setDetail(true);
    setTransactionDetail(item);
    setTransactionProducts(products);
  };

  useEffect(() => {
    getProduct();
  }, []);

  console.log(products);

  return (
    <Flex
      w={"100%"}
      border={"1px solid gray"}
      borderRadius={"10px"}
      mb={4}
      p={4}
      justifyContent={"space-between"}
      _hover={{ bg: "gray.100", cursor: "pointer" }}
      onClick={handleClick}>
      <Box>
        <Text fontSize={"xl"} fontWeight={"semibold"} textDecoration={"underline"} textTransform={"uppercase"}>
          Order#{item.user_id}
          {item.id}
        </Text>
        <Text color={"gray.400"}>{changeDate(item.createdAt)}</Text>
        <Badge
          bg={orderStatusArray[item.status].color}
          fontWeight={"bold"}
          mt={4}
          textColor={"white"}
          borderRadius={"2xl"}
          px={3}
          py={1}>
          {orderStatusArray[item.status].status}
        </Badge>
        {item.message && <Text>Message: {item.message}</Text>}
      </Box>
      <Box>
        {products && (
          <Image
            src={products[0]?.Product.product_img}
            alt={`Image for Order #${item.user_id}${item.id}${products[0]?.Product.name}`}
          />
        )}
        <Text fontWeight={"bold"}>Harga: Rp.{item.total_price},-</Text>
        <Text fontWeight={"bold"}>Harga Ongkir: Rp.{item.delivery_price},-</Text>
      </Box>
    </Flex>
  );
};

export default UserOrderOngoingCard;
