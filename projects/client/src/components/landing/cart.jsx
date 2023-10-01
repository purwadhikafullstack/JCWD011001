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
import { useNavigate } from "react-router-dom";
import { FaShopify } from "react-icons/fa";
import ProductReducer from "../../redux/reducer/ProductReducer";

const URL_API = process.env.REACT_APP_API_BASE_URL;
export default function Cart() {
  const PUBLIC_URL = "http://localhost:8000";
  const { login } = useSelector((state) => state.AuthReducer);
  const { item } = useSelector((state) => state.CartReducer);
  const { store_id } = useSelector((state) => state.ProductReducer);
  console.log("streoe id", store_id);
  const getImage = (image) => {
    return `${PUBLIC_URL}/${image}`;
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inCart = async (products) => {
    console.log("in", products);
    await dispatch(addToCart(products));
    await dispatch(addQuantity(products));
    await dispatch(getItem(store_id));
    await dispatch(getCart());
  };

  const outCart = async (products) => {
    await dispatch(deleteFromCart(products));
    await dispatch(deleteItem(products));
    await dispatch(getItem(store_id));
    await dispatch(getCart());
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

  useEffect(() => {
    dispatch(getItem(store_id));
    dispatch(getCart());
  }, [store_id]);
  return (
    <>
      <Navbar />
      {login ? (
        <Box fontFamily={"montserrat"}>
          <Stack>
            <Box
              ml={"100px"}
              mt={"48px"}
              fontSize={"2xl"}
              fontWeight={"bold"}
              fontFamily={"montserrat"}
            >
              <Text>Cart</Text>
            </Box>
            <Divider colorScheme="blackAlpha"></Divider>
            <Flex>
              <Box>
                {item.length === 0 ? (
                  <Box ml={"100px"}>
                    <Text>You haven't shop today, click the button below</Text>
                    <Button
                      // bg={"brand.main"}
                      _hover={{ bg: "brand.hover", color: "white" }}
                      color={"black"}
                      onClick={() => navigate("/")}
                      width={"800px"}
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
                      <Box key={products.id}>
                        <Card
                          mt={"8"}
                          w={{
                            base: "300px",
                            sm: "400px",
                            md: "500px",
                            lg: "800px",
                          }}
                          ml={"100px"}
                          boxShadow={"lg"}
                          key={products.id}
                        >
                          <CardBody>
                            <Box fontWeight={"bold"} mb={"24px"}>
                              <Text>{products.Store?.name}</Text>
                            </Box>
                            <Flex>
                              <Image
                                src={getImage(products.Product?.product_img)}
                                w={"20%"}
                              />
                              <Box ml={"32px"}>
                                <Text>{products.name}</Text>
                                <Text fontWeight={"bold"}>
                                  Rp. {products.price}
                                </Text>
                              </Box>
                            </Flex>
                            <Flex justify={"space-between"}>
                              <Box>
                                <IconButton
                                  color={"blackAlpha.600"}
                                  variant={""}
                                  icon={<IoTrashOutline size={"md"} />}
                                  onClick={() => destroy(products)}
                                />
                              </Box>
                              <Box ml={{ md: "200px", lg: "400px" }}>
                                <ButtonGroup variant={"none"}>
                                  <IconButton
                                    color={"red"}
                                    icon={<AiOutlineMinusCircle />}
                                    isDisabled={products.quantity === 1}
                                    onClick={() => outCart(products)}
                                  ></IconButton>
                                  <Text fontSize={"2xl"}>
                                    {products.quantity}
                                  </Text>
                                  <IconButton
                                    color={"green"}
                                    icon={<AiOutlinePlusCircle />}
                                    onClick={() => inCart(products)}
                                  ></IconButton>
                                </ButtonGroup>
                              </Box>
                            </Flex>
                          </CardBody>
                        </Card>
                      </Box>
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
        <Box>
          <Text>Please Login Fist</Text>
        </Box>
      )}
    </>
  );
}
