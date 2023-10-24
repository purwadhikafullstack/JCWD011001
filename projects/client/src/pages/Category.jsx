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
    base: "100%",
    md: "50%",
    lg: "48%",
  });

  const handleOrderBy = () => {
    setOrderBy(orderBy === "name" ? "price" : "name");
  };
  const handleOrder = () => {
    setOrder(order === "ASC" ? "DESC" : "ASC");
  };

  useEffect(() => {
    if (!location) dispatch(getProduct({ category: id, orderBy, order, index }));
    if (location) dispatch(getStoreProduct({ location, lon, lat, orderBy, order, category: id, index }));
  }, [index, orderBy, order, location, store]);

  if (products.length < 1) {
    return (
      <Box maxW={maxBoxWidth} w="100%" py="40px" px={{ base: "20px" }} mx={"auto"}>
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
        <Center h="30vh" flexDirection="column" border={"1px dashed gray"} m={"10"}>
          <Icon as={AiOutlineInbox} boxSize={12} color="gray.500" mb={4} />
          <Text fontSize="2xl" fontWeight="bold">
            We Are Going To Add More Product in This Category.
          </Text>
        </Center>
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
      <Flex
        gap={{ base: 4, md: 8 }}
        justifyContent="center"
        flexWrap="wrap"
        maxW={maxBoxWidth}
        w="100%"
        py="40px"
        px={{ base: "20px" }}
        mx={"auto"}>
        {products.map((product) => (
          <ProductListItem product={product} key={product.id} />
        ))}
      </Flex>
      <Center mt={6}>
        <Pagination page={page} index={index} setIndex={setIndex} />
      </Center>
    </Box>
  );
};

export default Category;
