import { Table, Thead, Tbody, Tr, Th, Td, Box, Center, Skeleton, Stack, Icon, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import BranchSalesReportProductDetail from "./BranchSalesReportProductDetail";
import { Pagination } from "../../components/Pagination";
import { AiOutlineInbox } from "react-icons/ai";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const BranchSalesReportProduct = ({ id, orderState, endDateState, startDateState }) => {
  const { order, setOrder } = orderState;
  const { endDate, setEndDate } = endDateState;
  const { startDate, setStartDate } = startDateState;
  const [index, setIndex] = useState(1);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const fetchData = async () => {
    try {
      let query = `?page=${index}`;
      if (startDate) query += `&startDate=${startDate}`;
      if (endDate) query += `&endDate=${endDate}`;
      if (order) query += `&order=${order}`;
      const { data } = await axios.get(`${URL_API}/report/product/${id}/${query}`);
      await setPage(data.totalPage);
      await setData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRowClick = (product) => {
    setSelectedProduct(product);
  };

  useEffect(() => {
    fetchData();
  }, [id, endDate, startDate, order, index]);

  if (data === null || data.length === 0) {
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
          Sorry, there are no product yet.
        </Text>
        <Text fontSize={{ base: "md", sm: "lg", md: "xl" }} color="gray.600">
          It looks like you didn't have any product.
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
              <Th>Product ID</Th>
              <Th>Name</Th>
              <Th>Price</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item, index) => (
              <Tr key={index} _hover={{ bg: "gray.100" }} cursor={"pointer"} onClick={() => handleRowClick(item)}>
                <Td>{item.Product.id}</Td>
                <Td>{item.Product.name}</Td>
                <Td>Rp.{item.Product.price},-</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Center>
      <Pagination page={page} index={index} setIndex={setIndex} />
      {selectedProduct && (
        <BranchSalesReportProductDetail
          product={selectedProduct.Product}
          store_id={id}
          orderState={orderState}
          endDateState={endDateState}
          startDateState={startDateState}
        />
      )}
    </Stack>
  );
};

export default BranchSalesReportProduct;
