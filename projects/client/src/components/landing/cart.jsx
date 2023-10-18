import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  IconButton,
  Image,
  Spacer,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../../assets/logo_main.png";
import { IoTrashOutline } from "react-icons/io5";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import Transactions from "./Transactions";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import {
  addCart,
  addQuantity,
  addToCart,
  deleteFromCart,
  deleteItem,
  deleteItemCart,
  deleteItemFromCart,
  getCart,
  getItem,
} from "../../redux/reducer/CartReducer";
import { Link, useNavigate } from "react-router-dom";
import { FaShopify } from "react-icons/fa";
import ProductReducer from "../../redux/reducer/ProductReducer";
import axios from "axios";
import OnGoingCart from "./OnGoingCart";
import CartLogin from "./CartLogin";

const URL_API = process.env.REACT_APP_API_BASE_URL;
export default function Cart() {
  const PUBLIC_URL = "http://localhost:8000";
  const { login } = useSelector((state) => state.AuthReducer);
  const { item } = useSelector((state) => state.CartReducer);
  const { store_id } = useSelector((state) => state.ProductReducer);
  const [sold, setSold] = useState([]);
  const [idProduct, setIdProduct] = useState(0);
  const [branchProduct, setBranchProduct] = useState([]);

  const getImage = (image) => {
    return `${PUBLIC_URL}/${image}`;
  };
  const getItemDetails = async (id) => {
    try {
      const response = await axios.get(
        `${URL_API}/product/item/detail/${id}/${store_id}`
      );
      // console.log("data get item", response);
      // console.log("data get item productBranc", response.data.ProductBranch);
      setBranchProduct(response.data.ProductBranch);
      // console.log("data get item", response.data.Item);
      setSold(response.data.Item);
    } catch (error) {
      console.log(error);
    }
  };
  const cekQuantity = async (products) => {
    console.log("masukk ", products);
    console.log("masukk ", products.product_id);
    try {
      const response = await axios.get(
        `${URL_API}/product/item/detail/${products.product_id}/${store_id}}`
      );
      console.log("apa respon ?", response);
      const itemQuantity = response.data.ProductBranch?.quantity;
      console.log("QUAN", itemQuantity);
      return false;
      // if (products.quantity >= itemQuantity) {
      //   return false;
      // }
      // return true;
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inCart = async (products) => {
    console.log("in", products);
    await dispatch(addToCart(products));
    await dispatch(addQuantity(products));
    console.log("store depan ", products.store_id);
    await dispatch(getItem(store_id));
    await dispatch(getCart());
    // await getItemDetails(products.Product?.id);
  };

  const outCart = async (products) => {
    await dispatch(deleteFromCart(products));
    await dispatch(deleteItem(products));
    await dispatch(getItem(store_id));
    await dispatch(getCart());
    // await getItemDetails(products.Product?.id);
  };

  const destroy = async (products) => {
    console.log("delete", products);
    await dispatch(deleteItemCart(products));
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this item from your cart?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonColor: "#d33",
      icon: "warning",
      dangerMode: true,
    });
    if (result.isConfirmed) {
      await dispatch(deleteItemFromCart(products));
      await dispatch(deleteItemCart(products));
      Swal.fire(
        "Deleted!",
        "The item has been removed from the cart.",
        "success"
      );
    }
    await dispatch(getItem(store_id));
    await dispatch(getCart());
  };
  const dapat = async () => {
    if (item && item.length > 0) {
      await item.forEach((items) => {
        if (items.Product) {
          // console.log("haha", items.Product.id);
          getItemDetails(items.Product.id);
        }
      });
    }
  };

  useEffect(() => {
    if (login) {
      dispatch(getItem(store_id));
      dispatch(getCart());
    }
  }, [store_id]);

  useEffect(() => {
    if (login) {
      dapat();
    }
  }, [item]);

  return (
    <>
      <Navbar />
      {login ? (
        <Box>
          <Stack>
            <Box
              ml={{ base: "50px", lg: "100px" }}
              mt={"48px"}
              fontSize={"2xl"}
              fontWeight={"bold"}
            >
              <Text>Cart</Text>
            </Box>
            <Divider colorScheme="blackAlpha"></Divider>
            <Flex flexDir={{ base: "column", lg: "row" }} px={"50px"}>
              <Box>
                {item.length === 0 ? (
                  <Box ml={{ lg: "50px" }}>
                    <Text>You haven't shop today, click the button below</Text>
                    <Button
                      _hover={{ bg: "brand.hover", color: "white" }}
                      color={"black"}
                      onClick={() => navigate("/shop")}
                      // w={"100%"}
                      width={{ base: "400px", md: "680px", lg: "800px" }}
                      mt={"32px"}
                      variant={""}
                      borderRadius={"10px"}
                      rightIcon={<FaShopify />}
                    >
                      See our products
                    </Button>
                  </Box>
                ) : (
                  item.map((products) => {
                    return (
                      <OnGoingCart key={products.id} products={products} />
                    );
                  })
                )}
              </Box>
              <Box>
                <Transactions />
              </Box>
            </Flex>
          </Stack>
        </Box>
      ) : (
        <CartLogin />
      )}
    </>
  );
}
