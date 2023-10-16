import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Flex,
  Heading,
  Spinner,
  Text,
  Stack,
  Icon,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductListItem from "./ProductListItem";
import { Pagination } from "../components/Pagination";
import { getProduct, getStoreProduct } from "../../redux/reducer/ProductReducer";
import SearchProducts from "../components/SearchProducts";
import { addCart, addToCart } from "../../redux/reducer/CartReducer";
import { AiOutlineInbox } from "react-icons/ai";

const ProductList = () => {
  const products = useSelector((state) => state.ProductReducer.product);
  const { store, store_id } = useSelector((state) => state.ProductReducer);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("ASC");
  const { location, lon, lat } = useSelector((state) => state.AuthReducer);
  const { page } = useSelector((state) => state.ProductReducer);
  const [index, setIndex] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location) dispatch(getProduct({ index, orderBy, order }));
    if (location) dispatch(getStoreProduct({ location, lon, lat, index, orderBy, order }));
  }, [index, lon, lat, store, store_id, location, orderBy, order]);

  const handleOrderBy = () => {
    setOrderBy(orderBy === "name" ? "price" : "name");
  };
  const handleOrder = () => {
    setOrder(order === "ASC" ? "DESC" : "ASC");
  };

  if (products.length < 1) {
    return (
      <Box w="100%" py="40px" px={{ base: "20px", md: "60px", lg: "100px" }}>
        <Stack spacing={4}>
          <Heading as="h2" mx={"auto"} textAlign={"center"}>
            {store ? store : "Our Most Recent Product"}
          </Heading>
          <Flex gap={2} justify="space-between">
            <SearchProducts />
            <Box>
              <Button onClick={handleOrderBy} mr={2}>
                <Text>Order By: </Text>
                {orderBy === "name" ? "name" : "Price"}
              </Button>
              <Button onClick={handleOrder}>
                <Text>Order: </Text>
                {order === "ASC" ? "Ascending" : "Descending"}
              </Button>
            </Box>
          </Flex>
        </Stack>
        <Box mt={10} textAlign="center" border={"1px dashed gray"} p={4}>
          <Icon as={AiOutlineInbox} boxSize={12} color="gray.500" mb={4} />
          <Text fontSize="lg" fontWeight="bold">
            No products found.
          </Text>
          <Text fontSize="md" color="gray.600">
            There are currently no products available.
          </Text>
        </Box>{" "}
      </Box>
    );
  }

  return (
    <Box w="100%" py="40px" px={{ base: "20px", md: "60px", lg: "100px" }}>
      <Stack spacing={6} mb={10}>
        <Heading as="h2" textAlign="center">
          {store ? store : "Our Recent Product"}
        </Heading>
        {store && (
          <Flex direction={{ base: "column", md: "row" }} gap={2} justify="space-between" mx="auto" w="100%">
            <SearchProducts />
            <Box>
              <Button onClick={handleOrderBy} mr={2}>
                <Text>Order By: </Text>
                {orderBy === "name" ? "name" : "Price"}
              </Button>
              <Button onClick={handleOrder}>
                <Text>Order: </Text>
                {order === "ASC" ? "Ascending" : "Descending"}
              </Button>
            </Box>
          </Flex>
        )}
      </Stack>
      <Flex direction={{ base: "column", md: "row" }} align="center" justify="center" w="100%" gap={4}>
        {products.map((product, index) => (
          <ProductListItem product={product} key={index} />
        ))}
      </Flex>
      {store && <Pagination page={page} index={index} setIndex={setIndex} />}
    </Box>
  );
};

export default ProductList;
