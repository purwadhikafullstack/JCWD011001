import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import StockManagementHistoryDetail from "./StockManagementHistoryDetail";
import { Pagination } from "../../components/Pagination";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const StockManagementHistory = ({ setDetail, itemDetail }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [index, setIndex] = useState(1);
  const [page, setPage] = useState(1);
  const { store_id, product_id } = itemDetail;
  const PUBLIC_URL = "http://localhost:8000";
  const getImage = (image) => {
    return `${PUBLIC_URL}/${image}`;
  };
  const [data, setData] = useState([]);
  const handleBack = () => {
    setDetail(0);
    setData([]);
  };

  const fetchData = async ({ startDate, endDate, index }) => {
    const token = localStorage.getItem("token");
    let query = `&page=${index}`;
    if (startDate) query += `&startDate=${startDate}`;
    if (endDate) query += `&endDate=${endDate}`;
    console.log("query", query);
    const { data } = await axios.get(`${URL_API}/store/stock/?store_id=${store_id}&product_id=${product_id}${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await setPage(data.totalPage);
    await setData(data.data);
  };

  useEffect(() => {
    fetchData({ startDate, endDate, index });
  }, [startDate, endDate, index]);

  return (
    <Box mx={{ base: "0", sm: "12px" }} mt={{ base: "0", sm: "24px" }}>
      <Button onClick={handleBack} bg={"brand.main"} _hover={{ bg: "brand.hover" }} color={"white"}>
        Back
      </Button>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={{ base: "2", md: "4" }}
        boxShadow="lg"
        width={{ base: "100%", sm: "auto" }}
        mt={{ base: "24px", sm: "48px" }}
        mx="auto"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection={{ base: "column", md: "row" }}>
        <Flex alignItems="center" justifyContent={{ base: "center", md: "flex-start" }} mb={{ base: "4", md: "0" }}>
          <Image
            src={getImage(itemDetail.Product.product_img) || "/default-image.jpg"}
            alt={itemDetail.name}
            boxSize={{ base: "100px", md: "150px" }}
            objectFit="cover"
          />
          <Box ml={{ base: "0", md: "4" }} mt={{ base: "4", md: "0" }}>
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
              {itemDetail.name}
            </Text>
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
              Price: Rp.{itemDetail.Product.price},-
            </Text>
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
              Discount: Rp.{itemDetail.Product.admin_discount},-
            </Text>
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
              Quantity: {itemDetail.quantity}
            </Text>
          </Box>
        </Flex>
      </Box>
      {data && (
        <StockManagementHistoryDetail
          history={data}
          setData={setData}
          startDate={startDate}
          endDate={endDate}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
          page={index}
          setIndex={setIndex}
        />
      )}
      <Pagination page={page} index={index} setIndex={setIndex} />
    </Box>
  );
};

export default StockManagementHistory;
