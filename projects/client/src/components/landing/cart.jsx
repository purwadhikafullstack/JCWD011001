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
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { IoTrashOutline } from "react-icons/io5";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import Transactions from "./Transactions";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  addCart,
  addToCart,
  deleteFromCart,
  deleteItem,
  deleteItemCart,
  deleteItemFromCart,
  getCart,
  getItem,
} from "../../redux/reducer/CartReducer";

const URL_API = process.env.REACT_APP_API_BASE_URL;
export default function Cart() {
  const { login } = useSelector((state) => state.AuthReducer);
  const { cart, carts, item } = useSelector((state) => state.CartReducer);
  const toast = useToast();
  // const {total_harga}

  const dispatch = useDispatch();
  const inCart = async (products) => {
    await dispatch(addToCart(products));
    await dispatch(addCart(products));
    await dispatch(getItem());
    await dispatch(getCart());
  };

  const outCart = async (products) => {
    await dispatch(deleteFromCart(products));
    await dispatch(deleteItem(products));
    await dispatch(getItem());
    await dispatch(getCart());
  };

  const destroy = async (products) => {
    await dispatch(deleteItemCart(products));
    await dispatch(deleteItemFromCart(products));
    await dispatch(getItem());
    await dispatch(getCart());
  };

  useEffect(() => {
    dispatch(getItem());
  }, []);
  return (
    <>
      <Navbar />
      {login ? (
        <Box>
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
                {item.map((products) => {
                  return (
                    <Box>
                      <Card
                        mt={"8"}
                        w={"800px"}
                        ml={"100px"}
                        boxShadow={"lg"}
                        key={products.id}
                      >
                        <CardBody>
                          <Box fontWeight={"bold"} mb={"24px"}>
                            <Text>Click and Play</Text>
                          </Box>
                          <Flex>
                            <Image
                              src="https://cdn10.bigcommerce.com/s-f70ch/products/106/images/307/18__31743.1449827934.1280.1280.jpg?c=2"
                              w={"20%"}
                            />
                            <Box ml={"32px"}>
                              <Text>{products.name}</Text>
                              <Text fontWeight={"bold"}>
                                Rp. {products.price}
                              </Text>
                            </Box>
                          </Flex>
                        </CardBody>
                        <CardFooter>
                          <Flex justify={"space-between"}>
                            <Box>
                              <IconButton
                                color={"blackAlpha.600"}
                                variant={""}
                                icon={<IoTrashOutline size={"md"} />}
                                onClick={() => destroy(products)}
                              />
                            </Box>
                            <Box ml={"600px"}>
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
                        </CardFooter>
                      </Card>
                    </Box>
                  );
                })}
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
