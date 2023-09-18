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
import { addCart, addToCart, deleteFromCart, deleteItem, getCart, getItem } from "../../redux/reducer/CartReducer";
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

  useEffect(() => {
    dispatch(getItem());
  }, []);
  return (
    <>
      <Navbar />
      {login ? (
        <Box>
          <Stack>
            <Box ml={"100px"} mt={"48px"} fontSize={"2xl"} fontWeight={"bold"} fontFamily={"montserrat"}>
              <Text>Cart</Text>
            </Box>
            <Divider colorScheme="blackAlpha"></Divider>
            <Flex>
              {item.map((products) => {
                return (
                  <Box>
                    <Card w={"800px"} ml={"100px"} boxShadow={"lg"} key={products.id}>
                      <CardBody>
                        <Box fontWeight={"bold"} mb={"24px"}>
                          <Text>Click and Play</Text>
                        </Box>
                        <Flex>
                          <Box w={"100px"} h={"100px"} bgColor={"gray"}>
                            Image
                          </Box>
                          <Box ml={"32px"}>
                            <Text>{products.name}</Text>
                            <Text fontWeight={"bold"}>Rp. {products.price}</Text>
                          </Box>
                        </Flex>
                      </CardBody>
                      <CardFooter>
                        <Flex justify={"space-between"}>
                          <Box>
                            <IconButton color={"blackAlpha.600"} variant={""} icon={<IoTrashOutline size={"md"} />} />
                          </Box>
                          <Box ml={"600px"}>
                            <ButtonGroup variant={"none"}>
                              <IconButton
                                color={"red"}
                                icon={<AiOutlineMinusCircle />}
                                isDisabled={products.quantity === 1}
                                onClick={() => outCart(products)}></IconButton>
                              <Text fontSize={"2xl"}>{products.quantity}</Text>
                              <IconButton
                                color={"green"}
                                icon={<AiOutlinePlusCircle />}
                                onClick={() => inCart(products)}></IconButton>
                            </ButtonGroup>
                          </Box>
                        </Flex>
                      </CardFooter>
                    </Card>
                  </Box>
                );
              })}

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
