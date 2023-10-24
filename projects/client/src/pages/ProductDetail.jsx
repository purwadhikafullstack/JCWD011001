import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Heading,
  IconButton,
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
import getImage from "../utils/getImage";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FaMinus, FaPlus } from "react-icons/fa";
import UserLocation from "../components/landing/UserLocation";
import { BsPlusSquareFill } from "react-icons/bs";

const URL_API = process.env.REACT_APP_API_BASE_URL;

const ProductDetail = () => {
  const { store_id } = useSelector((state) => state.ProductReducer);
  const { login } = useSelector((state) => state.AuthReducer);
  const [product, setProduct] = useState([]);
  const [stock, setStock] = useState([]);
  const [sold, setSold] = useState([]);
  const [jumlah, setJumlah] = useState(1);
  const [branchProduct, setBranchProduct] = useState([]);
  const [isDiscount, setIsDiscount] = useState(false);
  const pathname = window.location.pathname.split("/");
  const id = pathname[pathname.length - 1];
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getProductStock = async (id) => {
    try {
      if (!id) return;
      const { data } = await axios.get(`${URL_API}/product/stock?id=${id}`);
      await setStock(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getItemDetails = async (id) => {
    try {
      if (!id) return;
      const response = await axios.get(
        `${URL_API}/product/item/detail/${id}/${store_id}`
      );
      await setBranchProduct(response.data.ProductBranch);
      await setSold(response.data.Item);
    } catch (error) {
      console.log(error);
    }
  };

  const getProductDetail = async () => {
    try {
      let apiUrl = `${URL_API}/product/detail?id=${id}`;
      if (store_id) apiUrl += `&store_id=${store_id}`;
      await getProductStock(id);
      await getItemDetails(id);
      const { data } = await axios.get(apiUrl);
      const productData = data.data?.Product || data.data;
      await setProduct(productData);
      if (productData.admin_discount > 0) await setIsDiscount(true);
      if (data.data.quantity) await setStock(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const inCart = async (products, store_id) => {
    await dispatch(addToCart(products, jumlah));
    await dispatch(addCart(products, store_id, jumlah, Swal));
    await dispatch(getItem(store_id));
    await getItemDetails(product.id);
  };

  useEffect(() => {
    getProductDetail();
  }, [store_id]);

  const incrementQuantity = () => {
    setJumlah(jumlah + 1);
  };

  const decrementQuantity = () => {
    if (jumlah > 1) {
      setJumlah(jumlah - 1);
    }
  };
  if (!product) return <Notfound />;

  return (
    <Box width={{ base: "90%", md: "50%" }} mx="auto" mt={4} p={4}>
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
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: 4, md: 8 }}
        >
          <Image
            src={getImage(product.product_img) || null}
            w={{ base: "100%", md: "50%" }}
            fit={"cover"}
            overflow={"hidden"}
            boxShadow={"2xl"}
          />
          <Box w={{ base: "100%", md: "50%" }}>
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
                <Text mb={4}>
                  Stock {stock.Store?.name}: {stock?.quantity}
                </Text>
                {login ? (
                  <Tooltip
                    label={stock.quantity < 10 ? "Low stock" : "Add to cart!"}
                    bg={"brand.main"}
                    aria-label="A tooltip"
                  >
                    <Box>
                      <Flex mt={3}>
                        <ButtonGroup gap={"22px"}>
                          <IconButton
                            variant={"ghost"}
                            _hover={{
                              bgColor: "red",
                              color: "white",
                            }}
                            rounded={"full"}
                            disabled={jumlah <= 1}
                            icon={<FaMinus />}
                            onClick={decrementQuantity}
                          ></IconButton>
                          <Text fontWeight={"bold"} fontSize={"24px"}>
                            {jumlah}
                          </Text>
                          <IconButton
                            icon={<FaPlus />}
                            rounded={"full"}
                            variant={"ghost"}
                            size={"md"}
                            _hover={{
                              bgColor: "brand.hover",
                              color: "white",
                            }}
                            isDisabled={
                              jumlah === branchProduct?.quantity ||
                              jumlah ===
                                branchProduct?.quantity - sold?.quantity ||
                              (sold?.quantity ?? 0) ===
                                (branchProduct?.quantity ?? 0) ||
                              jumlah + (sold?.quantity ?? 0) >= stock.quantity
                            }
                            onClick={incrementQuantity}
                          ></IconButton>
                        </ButtonGroup>
                      </Flex>
                      <Button
                        mt={5}
                        w={"180px"}
                        variant={"outline"}
                        colorScheme="teal"
                        leftIcon={<HiOutlineShoppingCart />}
                        onClick={() => inCart(product, store_id, jumlah)}
                        isDisabled={
                          login === false ||
                          (sold?.quantity ?? 0) ===
                            (branchProduct?.quantity ?? 0) ||
                          jumlah + (sold?.quantity ?? 0) > stock.quantity
                        }
                      >
                        {(sold?.quantity ?? 0) ===
                        (branchProduct?.quantity ?? 0)
                          ? "Out of Stock"
                          : `Add ${jumlah} to Cart`}
                      </Button>
                    </Box>
                    {/* <Button
                      variant={"outline"}
                      colorScheme="teal"
                      leftIcon={<HiOutlineShoppingCart />}
                      onClick={() => inCart(product, store_id)}
                      isDisabled={
                        login === false ||
                        (sold?.quantity ?? 0) === (branchProduct?.quantity ?? 0)
                      }>
                      {(sold?.quantity ?? 0) === (branchProduct?.quantity ?? 0)
                        ? "Out of Stock"
                        : "Add Cart"}
                    </Button> */}
                  </Tooltip>
                ) : (
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
                )}
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
                  {stock.length === 0 && (
                    <Text>WE ARE GOING TO ADD THIS PRODUCT MORE STORE</Text>
                  )}
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
