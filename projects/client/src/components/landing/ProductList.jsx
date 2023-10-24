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
  useBreakpointValue,
  Select,
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
import { AiOutlineInbox } from "react-icons/ai";
import { getCategory } from "../../redux/reducer/CategoryReducer";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const displayDirection = useBreakpointValue({ base: "column", md: "row" });
  const maxBoxWidth = useBreakpointValue({
    base: "100%",
    md: "80%",
    lg: "60%",
  });
  const maxBoxStore = useBreakpointValue({
    base: "100%",
    md: "80%",
    lg: "45%",
  });
  const [isShop, setIsShop] = useState(false);
  const { category } = useSelector((state) => state.CategoryReducer);
  const [cat, setCat] = useState(0);
  const products = useSelector((state) => state.ProductReducer.product);
  const { store, store_id } = useSelector((state) => state.ProductReducer);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("ASC");
  const { location, lon, lat } = useSelector((state) => state.AuthReducer);
  const { page } = useSelector((state) => state.ProductReducer);
  const [index, setIndex] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const pathname = window.location.pathname.split("/");
    if (pathname[pathname.length - 1] === "shop") setIsShop(true);
    dispatch(getCategory());
    if (!location)
      dispatch(getProduct({ index, orderBy, order, category: cat }));
    if (location)
      dispatch(
        getStoreProduct({
          location,
          lon,
          lat,
          index,
          orderBy,
          order,
          category: cat,
        })
      );
  }, [index, lon, lat, store, store_id, location, orderBy, order, cat]);

  const handleOrderBy = () => {
    setOrderBy(orderBy === "name" ? "price" : "name");
  };
  const handleOrder = () => {
    setOrder(order === "ASC" ? "DESC" : "ASC");
  };

  if (!isShop &&  products.length > 0) {
    return (
      <Box
        maxW={maxBoxStore}
        w="100%"
        py="40px"
        px={{ base: "20px" }}
        mx={"auto"}
      >
        <Heading as="h2" mx={"auto"} textAlign={"center"} mb={"20px"}>
          Our Most Recent Product
        </Heading>

        <Box mx={{ sm: "50px", md: "40px" }}>
          <Flex
            direction="row"
            ml={location ? { base: "12px", md: "16px" } : "0px"}
            flexWrap="wrap"
            w="100%"
            gap={4}
            justifyContent={
              location ? "space-evenly" : "center"
            }
          >
            {products.map((product, index) => (
              <ProductListItem product={product} key={index} />
            ))}
            <Center w={"100%"} mt={4}>
              <Button
                w={{ base: "100%", md: "50%" }}
                bgColor="brand.main"
                color={"white"}
                _hover={{ bgColor: "brand.hover" }}
                _active={{ bgColor: "brand.active" }}
                onClick={() => {
                  navigate("/shop");
                }}
              >
                Shop Now
              </Button>
            </Center>
          </Flex>
        </Box>
      </Box>
    );
  }

  if (products.length < 1) {
    return (
      <Box
        maxW={maxBoxStore}
        w="100%"
        py="40px"
        px={{ base: "20px" }}
        mx={"auto"}
      >
        <Stack spacing={4}>
          <Heading as="h2" mx={"auto"} textAlign={"center"}>
            {store ? store : "Our Most Recent Product"}
          </Heading>
          <Flex
            gap={2}
            justify={{ base: "", md: "space-between" }}
            flexWrap={"wrap"}
          >
            <SearchProducts />
            {isShop && (
              <Select
                w={{ base: "50%", md: "35%" }}
                placeholder="Category"
                onChange={(e) => setCat(e.target.value)}
              >
                {category.map((item) => (
                  <option value={item.id}>{item.name}</option>
                ))}
              </Select>
            )}
            <Box w={{ base: "100%" }}>
              <Button
                w={{ base: "48%" }}
                onClick={handleOrderBy}
                mr={2}
                bgColor="#5a9819"
                color={"white"}
                _hover={{ bgColor: "#3d550f" }}
              >
                {orderBy === "name" ? "NAME" : "PRICE"}
              </Button>
              <Button
                w={{ base: "48%" }}
                onClick={handleOrder}
                bgColor="#5a9819"
                color={"white"}
                _hover={{ bgColor: "#3d550f" }}
              >
                {order === "ASC" ? "ASC" : "DESC"}
              </Button>
            </Box>{" "}
          </Flex>
        </Stack>
        <Box mt={10} textAlign="center" border={"1px dashed gray"} p={4}>
          <Icon as={AiOutlineInbox} boxSize={12} color="gray.500" mb={4} />
          <Text fontSize="lg" fontWeight="bold">
            No products found.
          </Text>
          <Text fontSize="md" color="gray.600">
            There are no product here, we are going to add more soon.
          </Text>
        </Box>{" "}
      </Box>
    );
  }

  return (
    <Box
      maxW={maxBoxStore}
      w="100%"
      py="40px"
      px={{ base: "20px" }}
      mx={"auto"}
    >
      <Stack spacing={6} mb={10}>
        <Heading as="h2" textAlign="center">
          {store ? store : "Our Recent Product"}
        </Heading>
        {store && (
          <Flex gap={2} flexWrap={"wrap"}>
            <SearchProducts />
            {isShop && (
              <Select
                w={{ base: "48%" }}
                placeholder="Category"
                onChange={(e) => setCat(e.target.value)}
              >
                {category.map((item) => (
                  <option value={item.id}>{item.name}</option>
                ))}
              </Select>
            )}
            <Box w={{ base: "100%" }}>
              <Button
                w={{ base: "48%" }}
                onClick={handleOrderBy}
                mr={2}
                bgColor="#5a9819"
                color={"white"}
                _hover={{ bgColor: "#3d550f" }}
              >
                {orderBy === "name" ? "NAME" : "PRICE"}
              </Button>
              <Button
                w={{ base: "48%" }}
                onClick={handleOrder}
                bgColor="#5a9819"
                color={"white"}
                _hover={{ bgColor: "#3d550f" }}
              >
                {order === "ASC" ? "ASC" : "DESC"}
              </Button>
            </Box>
          </Flex>
        )}
      </Stack>
      <Box mx={{ sm: "50px", md: "40px" }}>
        <Flex
          direction="row"
          ml={location ? { base: "12px", md: "16px" } : "0px"}
          flexWrap="wrap"
          w="100%"
          gap={4}
          justifyContent={location ? "space-evenly" : "center"}
        >
          {products.map((product, index) => (
            <ProductListItem product={product} key={index} />
          ))}
        </Flex>
        {store && <Pagination page={page} index={index} setIndex={setIndex} />}
      </Box>
    </Box>
  );
};

export default ProductList;
