import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Image,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setProductDetail } from "../redux/reducer/ProductReducer";
import { Link, useNavigate } from "react-router-dom";
import ProductStock from "./ProductStock";
import { store } from "../redux/store";
import Notfound from "./Notfound";
import { HiOutlineShoppingCart } from "react-icons/hi";
import {
  addCart,
  addToCart,
  getItem,
  setChanges,
} from "../redux/reducer/CartReducer";
import Swal from "sweetalert2";

const URL_API = process.env.REACT_APP_API_BASE_URL;

const ProductDetail = () => {
  const { store_id } = useSelector((state) => state.ProductReducer);
  const { login } = useSelector((state) => state.AuthReducer);
  const [product, setProduct] = useState([]);
  const [stock, setStock] = useState([]);
  const [isDiscount, setIsDiscount] = useState(false);
  const pathname = window.location.pathname.split("/");
  const id = pathname[pathname.length - 1];
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      await setProduct(productData);
      if (productData.admin_discount > 0) setIsDiscount(true);
      if (data.data.quantity) setStock(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const inCart = async (products, store_id) => {
    console.log("product list", products);
    console.log("product list discount admin", products.admin_discount);
    console.log("Store_id di kirim", store_id);
    await dispatch(addToCart(products));
    await dispatch(addCart(products, store_id, Swal));
    await dispatch(getItem(store_id));
  };

  useEffect(() => {
    getProductDetail();
  }, [store_id, id]);

  console.log("store_id", store_id);

  if (!product) return <Notfound />;

  return (
    <Box width={"50%"} mx={"auto"} mt={4}>
      <Box mb={4}>
        <Link to={"/"}>Home</Link>
        {" > "}
        <Link to={`/category/${product?.Category?.id}`}>
          {product?.Category?.name}
        </Link>
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
                  <Text
                    textAlign={"center"}
                    fontWeight={"bold"}
                    textDecoration={"line-through"}
                    color={"#9b9b9b"}
                  >
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
            {!isDiscount && (
              <Text fontWeight={"bold"}>Rp.{product?.price},-</Text>
            )}{" "}
            <Box my={4} textAlign={"justify"} pr={4}>
              {product?.description}
            </Box>
            <Divider my={4} />
            {store_id && (
              <>
                <Text>
                  Stock {stock.Store?.name}: {stock?.quantity}
                </Text>
                <Tooltip
                  label="Please login first!"
                  bg={"brand.main"}
                  aria-label="A tooltip"
                >
                  <Button
                    variant={"outline"}
                    colorScheme="teal"
                    leftIcon={<HiOutlineShoppingCart />}
                    onClick={() => inCart(product, store_id)}
                    isDisabled={login === false}
                  >
                    Add Cart
                  </Button>
                </Tooltip>
              </>
            )}
            {!store_id && (
              <>
                <Text textTransform={"uppercase"} fontWeight={"bold"} mb={4}>
                  Kami Belum Menyediakan Layanan di Lokasimu, Sementara ini kami
                  menyediakan produk di toko ini:
                </Text>
                <Flex gap={4} justify={"center"}>
                  {stock.map((product) => (
                    <ProductStock key={product.id} product={product} />
                  ))}
                </Flex>
              </>
            )}
            {/* <Button
              w={"full"}
              mt={4}
              variant={"outline"}
              colorScheme="teal"
              leftIcon={<HiOutlineShoppingCart />}
              onClick={() => inCart(product)}
              isDisabled={login === false || store_id === null}
            >
              Add Cart
            </Button> */}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default ProductDetail;
