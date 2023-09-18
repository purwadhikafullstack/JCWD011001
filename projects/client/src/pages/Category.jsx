import { Box, Button, Center, Flex, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Navbar from "../components/landing/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, getStoreProduct } from "../redux/reducer/ProductReducer";
import { Pagination } from "../components/components/Pagination";
import ProductListItem from "../components/landing/ProductListItem";
import SearchProducts from "../components/components/SearchProducts";

const Category = () => {
  const products = useSelector((state) => state.ProductReducer.product);
  const { store } = useSelector((state) => state.ProductReducer);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("ASC");
  const { location, lon, lat } = useSelector((state) => state.AuthReducer);
  const { page } = useSelector((state) => state.ProductReducer);
  const dispatch = useDispatch();
  const [index, setIndex] = useState(1);
  const pathname = window.location.pathname.split("/");
  const id = pathname[pathname.length - 1];

  const handleOrderBy = () => {
    setOrderBy(orderBy === "name" ? "price" : "name");
  };
  const handleOrder = () => {
    setOrder(order === "ASC" ? "DESC" : "ASC");
  };

  useEffect(() => {
    if (!location) dispatch(getProduct({ category: id, orderBy, order }));
    if (location) dispatch(getStoreProduct({ location, lon, lat, orderBy, order, category: id }));
  }, [index, orderBy, order, location]);

  if (products.length < 1) {
    return (
      <Box w={"100%"}>
        <Navbar />

        <Center mt={4}>
          <Stack mb={10} align={"center"}>
            <Heading mb={4}>Category</Heading>
            <Flex gap={2}>
              <Button onClick={handleOrderBy} gap={2}>
                <Text>Order By: </Text>
                {orderBy === "name" ? "name" : "Price"}
              </Button>
              <Button onClick={handleOrder} gap={2}>
                <Text>Order: </Text>
                {order === "ASC" ? "Ascending" : "Descending"}
              </Button>
            </Flex>
          </Stack>
        </Center>
        <Center h={"30vh"}>
          <Spinner size="xl" />
        </Center>
      </Box>
    );
  }
  return (
    <Box w={"100%"}>
      <Navbar />
      <Center mt={4}>
        <Heading mb={4}>Category</Heading>
      </Center>
      <Center>
        <Flex gap={2}>
          <Button onClick={handleOrderBy} gap={2}>
            <Text>Order By: </Text>
            {orderBy === "name" ? "name" : "Price"}
          </Button>
          <Button onClick={handleOrder} gap={2}>
            <Text>Order: </Text>
            {order === "ASC" ? "Ascending" : "Descending"}
          </Button>
        </Flex>
      </Center>
      <Flex gap={{ base: 4, md: 8 }} w={"80%"} justifyContent={"center"}>
        {products.map((product) => (
          <ProductListItem product={product} key={product.id} />
        ))}
      </Flex>
      <Pagination page={page} index={index} setIndex={setIndex} />
    </Box>
  );
};

export default Category;
