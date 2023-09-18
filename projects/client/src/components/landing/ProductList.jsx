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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductListItem from "./ProductListItem";
import { Pagination } from "../components/Pagination";
import { getProduct, getStoreProduct } from "../../redux/reducer/ProductReducer";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { addCart, addToCart } from "../../redux/reducer/CartReducer";
import Swal from "sweetalert2";

const ProductList = () => {
  const products = useSelector((state) => state.ProductReducer.product);
  const { location, lon, lat } = useSelector((state) => state.AuthReducer);
  const { page } = useSelector((state) => state.ProductReducer);
  const [index, setIndex] = useState(1);
  const dispatch = useDispatch();

  const inCart = async (products) => {
    await dispatch(addToCart(products));
    await dispatch(addCart(products, Swal));
  };
  useEffect(() => {
    if (!location) dispatch(getProduct({ index }));
    if (location) dispatch(getStoreProduct({ location, lon, lat, index }));
  }, [index, location]);

  if (products.length < 1) {
    return (
      <Center h={"30vh"}>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box w={"100%"} py={"40px"} px={{ base: "60px", lg: "100px" }}>
      <Box mb={10}>
        <Center>
          <Heading as={"h2"}>Products</Heading>
        </Center>
      </Box>
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
                onClick={() => inCart(product)}
              >
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
