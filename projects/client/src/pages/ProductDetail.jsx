import { Box, Divider, Flex, Heading, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setProductDetail } from "../redux/reducer/ProductReducer";
import { Link } from "react-router-dom";
import ProductStock from "./ProductStock";
import { store } from "../redux/store";
import AddtoCart from "../components/components/ButtonAddCart";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const ProductDetail = () => {
  const { store_id } = useSelector((state) => state.ProductReducer);
  const [product, setProduct] = useState([]);
  const [stock, setStock] = useState([]);
  const [isDiscount, setIsDiscount] = useState(false);
  const pathname = window.location.pathname.split("/");
  const id = pathname[pathname.length - 1];

  const getProductStock = async (id) => {
    try {
      const { data } = await axios.get(`${URL_API}/product/stock?id=${id}`);
      setStock(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getProductDetail = async () => {
    try {
      let apiUrl = `${URL_API}/product/detail?id=${id}`;
      if (store_id) apiUrl += `&store_id=${store_id}`;
      getProductStock(id);
      const { data } = await axios.get(apiUrl);
      const productData = data.data?.Product || data.data;
      setProduct(productData);
      if (productData.admin_discount > 0) setIsDiscount(true);
      if (data.data.quantity) setStock(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductDetail();
  }, [store_id, id]);

  return (
    <Box border={"1px solid red"} width={"50%"} mx={"auto"} mt={4}>
      <Box mb={4}>
        <Link>Home</Link>
        {" > "}
        <Link>{product?.Category?.name}</Link>
        {" > "}
        <Link>{product?.name}</Link>
      </Box>
      <Box>
        <Flex gap={{ base: 4, md: 8 }}>
          <Image
            src="https://cdn10.bigcommerce.com/s-f70ch/products/106/images/307/18__31743.1449827934.1280.1280.jpg?c=2"
            w={"45%"}
            boxShadow={"2xl"}
          />
          <Box>
            <Heading textTransform={"uppercase"} pr={4}>
              {product?.name}
            </Heading>
            <Divider my={4} />
            {isDiscount && (
              <>
                <Flex gap={2}>
                  <Text textAlign={"center"} fontWeight={"bold"} textDecoration={"line-through"} color={"#9b9b9b"}>
                    Rp.{product?.price},-
                  </Text>
                  <Text textAlign={"center"} fontWeight={"bold"}>
                    Rp.{product?.price - product?.admin_discount},-
                  </Text>
                  <Image
                    src="https://cdn.icon-icons.com/icons2/1138/PNG/512/1486395314-13-discount_80575.png"
                    w={"5%"}
                  />
                </Flex>
              </>
            )}
            {!isDiscount && <Text fontWeight={"bold"}>Rp.{product?.price},-</Text>}{" "}
            <Box my={4} textAlign={"justify"} pr={4}>
              {product?.description}
            </Box>
            <Divider my={4} />
            {store_id && (
              <>
                <Text>
                  Stock {stock.Store?.name}: {stock?.quantity}
                </Text>
              </>
            )}
            {!store_id && (
              <>
                <Text textTransform={"uppercase"} fontWeight={"bold"}>
                  Tersedia di:
                </Text>
                <Flex gap={4} justify={"center"}>
                  {stock.map((product) => (
                    <ProductStock key={product.id} product={product} />
                  ))}
                </Flex>
              </>
            )}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default ProductDetail;