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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductListItem from "./ProductListItem";
import { Pagination } from "../components/Pagination";
import {
  getProduct,
  getStoreProduct,
} from "../../redux/reducer/ProductReducer";
import SearchProducts from "../components/SearchProducts";
import { addCart, addToCart } from "../../redux/reducer/CartReducer";

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
    if (location)
      dispatch(getStoreProduct({ location, lon, lat, index, orderBy, order }));
  }, [index, lon, lat, store, store_id, location, orderBy, order]);

  const handleOrderBy = () => {
    setOrderBy(orderBy === "name" ? "price" : "name");
  };
  const handleOrder = () => {
    setOrder(order === "ASC" ? "DESC" : "ASC");
  };

  console.log("store productlist", store);
  console.log("store productlist id ", store_id);

  if (products.length < 1) {
    return (
      <Box w={"100%"} py={"40px"} px={{ base: "60px", lg: "100px" }}>
        <Stack mb={10}>
          <Heading as={"h2"}>
            Anda Sedang Melihat {store ? store : "Produk Terbaru Kami"}
          </Heading>
          <Flex gap={2} justify={"space-between"} mx={"20"}>
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
        <Center h={"30vh"}>
          <Spinner size="xl" />
        </Center>
      </Box>
    );
  }

  return (
    <Box w={"100%"} py={"40px"} px={{ base: "60px", lg: "100px" }}>
      <Stack mb={10}>
        <Heading as={"h2"} align={"center"}>
          Anda Sedang Melihat {store ? store : "Produk Terbaru Kami"}
        </Heading>
        <Flex gap={2} justify={"space-between"} mx={"20"}>
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
      <Flex gap={{ base: 4, md: 8 }} w={"80%"} justifyContent={"center"}>
        {products.map((product) => (
          <Card key={product.id}>
            <CardBody>
              <ProductListItem product={product} />
            </CardBody>
          </Card>
        ))}
      </Flex>
      <Pagination page={page} index={index} setIndex={setIndex} />
    </Box>
  );
};

export default ProductList;
