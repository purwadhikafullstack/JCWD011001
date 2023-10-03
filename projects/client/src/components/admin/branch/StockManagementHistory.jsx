import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import StockManagementHistoryDetail from "./StockManagementHistoryDetail";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const StockManagementHistory = ({ setDetail, itemDetail }) => {
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

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${URL_API}/store/stock/?store_id=${store_id}&product_id=${product_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await setData(data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box ml={"48px"} mt={"24px"}>
      <Button onClick={handleBack} bg={"brand.main"} _hover={{ bg: "brand.hover" }} color={"white"}>
        Back
      </Button>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p="4"
        boxShadow="lg"
        width="100%"
        mt={"48px"}
        mx="auto"
        display="flex"
        justifyContent="center"
        alignItems="center">
        <Flex alignItems="center">
          <Image
            src={getImage(itemDetail.Product.product_img) || "/default-image.jpg"}
            alt={itemDetail.name}
            boxSize="150px"
            objectFit="cover"
          />
          <Box ml="4">
            <Text fontSize="xl" fontWeight="bold">
              {itemDetail.name}
            </Text>
            <Text fontSize="lg" color="gray.600">
              Price: Rp.{itemDetail.Product.price},-
            </Text>
            <Text fontSize="lg" color="gray.600">
              Discount: Rp.{itemDetail.Product.admin_discount},-
            </Text>
            <Text fontSize="lg" color="gray.600">
              Quantity: {itemDetail.quantity}
            </Text>
          </Box>
        </Flex>
      </Box>
      {data && <StockManagementHistoryDetail history={data} setData={setData} />}
    </Box>
  );
};

export default StockManagementHistory;
