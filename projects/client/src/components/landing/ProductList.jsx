import { Box, Button, Card, CardBody, CardFooter, Center, Flex, Heading, Spinner, Text, Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductListItem from "./ProductListItem";
import { Pagination } from "../components/Pagination";
import { getProduct, getStoreProduct } from "../../redux/reducer/ProductReducer";
import SearchProducts from "../components/SearchProducts";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { addCart, addToCart } from "../../redux/reducer/CartReducer";
import Swal from "sweetalert2";

const ProductList = () => {
  const products = useSelector((state) => state.ProductReducer.product);
  const { store } = useSelector((state) => state.ProductReducer);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("ASC");
  const { location, lon, lat } = useSelector((state) => state.AuthReducer);
  const { page } = useSelector((state) => state.ProductReducer);
  const [index, setIndex] = useState(1);
  const dispatch = useDispatch();

  const inCart = async (products) => {
    console.log("product list", products);
    await dispatch(addToCart(products));
    await dispatch(addCart(products, Swal));
  };
  useEffect(() => {
    if (!location) dispatch(getProduct({ index, orderBy, order }));
    if (location) dispatch(getStoreProduct({ location, lon, lat, index, orderBy, order }));
  }, [index, location, orderBy, order]);

  const handleOrderBy = () => {
    setOrderBy(orderBy === "name" ? "price" : "name");
  };
  const handleOrder = () => {
    setOrder(order === "ASC" ? "DESC" : "ASC");
  };

  if (products.length < 1) {
    return (
      <Box w={"100%"} py={"40px"} px={{ base: "60px", lg: "100px" }}>
        <Center>
          <Stack mb={10} align={"center"}>
            <Heading as={"h2"}>Anda Sedang Melihat {store ? store : "Produk Semua Cabang"}</Heading>
            <Flex gap={2}>
              <SearchProducts />
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
    <Box w={"100%"} py={"40px"} px={{ base: "60px", lg: "100px" }}>
      <Center>
        <Stack mb={10} align={"center"}>
          <Heading as={"h2"}>Anda Sedang Melihat {store ? store : "Produk Semua Cabang"}</Heading>
          <Flex gap={2}>
            <SearchProducts />
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
      <Flex gap={{ base: 4, md: 8 }} w={"80%"} justifyContent={"center"}>
        {products.map((product) => (
          <Card>
            <CardBody>
              <ProductListItem product={product} key={product.id} />
            </CardBody>
            <CardFooter>
              <Button
                variant={"outline"}
                colorScheme="teal"
                leftIcon={<HiOutlineShoppingCart />}
                onClick={() => inCart(product)}>
                Add Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </Flex>
      <Pagination page={page} index={index} setIndex={setIndex} />
    </Box>
  );
};

export default ProductList;
