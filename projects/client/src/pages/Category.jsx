import { Box, Button, Center, Flex, Heading, Icon, Spinner, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Navbar from "../components/landing/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, getStoreProduct } from "../redux/reducer/ProductReducer";
import { Pagination } from "../components/components/Pagination";
import ProductListItem from "../components/landing/ProductListItem";
import SearchProducts from "../components/components/SearchProducts";
import { AiOutlineInbox } from "react-icons/ai";

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
  const maxBoxWidth = useBreakpointValue({
    base: "370px",
    md: "680px",
  });

  const handleOrderBy = () => {
    setOrderBy(orderBy === "name" ? "price" : "name");
  };
  const handleOrder = () => {
    setOrder(order === "ASC" ? "DESC" : "ASC");
  };

  useEffect(() => {
    if (!store) dispatch(getProduct({ category: id, orderBy, order, index }));
    if (store) dispatch(getStoreProduct({ location, lon, lat, orderBy, order, category: id, index }));
  }, [index, orderBy, order, location, store]);

  if (products.length < 1) {
    return (
      <Box w="100%" px={{ base: "20px" }} mx={"auto"}>
        <Navbar />
        <Center mt={4}>
          <Stack spacing={4} align="center">
            <Heading as="h2">Category</Heading>
            <Flex gap={2}>
              <Button onClick={handleOrderBy} gap={2} bgColor="#5a9819" color={"white"} _hover={{ bgColor: "#3d550f" }}>
                {orderBy === "name" ? "NAME" : "PRICE"}
              </Button>
              <Button onClick={handleOrder} gap={2} bgColor="#5a9819" color={"white"} _hover={{ bgColor: "#3d550f" }}>
                {order === "ASC" ? "ASC" : "DESC"}
              </Button>
            </Flex>
          </Stack>
        </Center>
        <Box mt={5} textAlign="center" border={"1px dashed gray"} p={4}>
          <Icon as={AiOutlineInbox} boxSize={12} color="gray.500" mb={4} />
          <Text fontSize="lg" fontWeight="bold">
            No products found.
          </Text>
          <Text fontSize="md" color="gray.600">
            There are no product here, we are going to add more soon.
          </Text>
        </Box>
      </Box>
    );
  }
  return (
    <Box>
      <Navbar />
      <Center my={4}>
        <Heading mb={4}>Category {products[0]?.Category?.name || products[0]?.Product?.Category?.name}</Heading>
      </Center>
      <Center>
        <Flex gap={2} mb={4}>
          <Button onClick={handleOrderBy} gap={2} bgColor="#5a9819" color={"white"} _hover={{ bgColor: "#3d550f" }}>
            {orderBy === "name" ? "NAME" : "PRICE"}
          </Button>
          <Button onClick={handleOrder} gap={2} bgColor="#5a9819" color={"white"} _hover={{ bgColor: "#3d550f" }}>
            {order === "ASC" ? "ASC" : "DESC"}
          </Button>
        </Flex>
      </Center>
      <Center justifyContent={"center"} w={maxBoxWidth} mx={"auto"} p={{ base: "40px 20px", md: "" }}>
        <Flex direction="row" flexWrap="wrap" w="100%" gap={4}>
          {products.map((product, index) => (
            <ProductListItem product={product} key={index} />
          ))}
        </Flex>
      </Center>
      <Center mt={6}>
        <Pagination page={page} index={index} setIndex={setIndex} />
      </Center>
    </Box>
  );
};

export default Category;
