import {
  Box,
  Center,
  Flex,
  Heading,
  Image,
  Text,
  Table,
  Th,
  Thead,
  Tr,
  Td,
  Tbody,
  Icon,
  Tfoot,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import getImage from "../../../utils/getImage";
import { render } from "react-dom";
import { AiOutlineInbox } from "react-icons/ai";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const BranchSalesReportProductDetail = ({ product, store_id, orderState, endDateState, startDateState }) => {
  const [productDetail, setProductDetail] = useState([]);
  const [monthSold, setMonthSold] = useState([]);
  const { order, setOrder } = orderState;
  const { endDate, setEndDate } = endDateState;
  const { startDate, setStartDate } = startDateState;

  const fetchProduct = async () => {
    try {
      let query = "?page=1";
      if (startDate) query += `&startDate=${startDate}`;
      if (endDate) query += `&endDate=${endDate}`;
      if (order) query += `&order=${order}`;
      const { data } = await axios.get(`${URL_API}/report/product/history/${product.id}/${store_id}/${query}`);
      await setProductDetail(data.data);
      await setMonthSold(data.month);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, [product, endDate, startDate, order]);

  const renderTable = () => {
    if (!monthSold || monthSold.length === 0) {
      return (
        <Box width="70%" mx="auto" mt={4} padding="2rem" borderRadius="8px" border="2px dashed #ccc" textAlign="center">
          <Icon as={AiOutlineInbox} boxSize={12} color="gray.500" mb={4} /> {/* Icon */}
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Sorry, no products sold.
          </Text>
          <Text fontSize="md" color="gray.600">
            It looks like no products have been sold for this period.
          </Text>
        </Box>
      );
    }

    return (
      <Table variant="simple" colorScheme="green" mb={20}>
        <Thead>
          <Tr>
            <Th>Year - Month</Th>
            <Th>Total Product Sold</Th>
            <Th>Sales</Th>
          </Tr>
        </Thead>
        <Tbody>
          {monthSold.map((item, index) => (
            <Tr key={index}>
              <Td>{item.month}</Td>
              <Td>{item.totalProductSold}</Td>
              <Td>Rp.{item.totalProductSold * product.price},-</Td>
            </Tr>
          ))}
        </Tbody>
        <Tbody>
          <Tr fontWeight={"bold"}>
            <Td>Total</Td>
            <Td>{monthSold.reduce((a, b) => +a + +b.totalProductSold, 0)}</Td>
            <Td>Rp.{monthSold.reduce((a, b) => a + b.totalProductSold * product.price, 0)},-</Td>
          </Tr>
        </Tbody>
      </Table>
    );
  };

  if (!product) return null;
  return (
    <Box my={"20px"} w={"100%"}>
      <Text fontSize={{ sm: "8px", md: "16px", lg: "24px" }}>Product {product.name}</Text>
      <Flex justifyContent={"space-evenly"} my={"20px"}>
        <Box w={"10%"}>
          <Image src={getImage(product.product_img) || ""} />
        </Box>
        <Box>{renderTable()}</Box>
      </Flex>
    </Box>
  );
};

export default BranchSalesReportProductDetail;
