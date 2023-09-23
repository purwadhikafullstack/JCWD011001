import {
  Box,
  Divider,
  Flex,
  Image,
  Text,
  useDisclosure,
  Select,
  Spinner,
  Button,
  Card,
  CardBody,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Logo from "../../assets/logo_main.png";
import ConfirmBackToCart from "../../components/user/ConfirmBackToCart";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../../redux/reducer/CartReducer";
import PlainFooter from "../../components/user/PlainFooter";
import axios from "axios";
import { getDefaultAddress } from "../../redux/reducer/AddressReducer";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const Checkout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.AuthReducer);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { defaultAddress } = useSelector((state) => state.AddressReducer);
  const { carts, item } = useSelector((state) => state.CartReducer);
  const { store_id } = useSelector((state) => state.ProductReducer);
  const nameExist = user.name ? user.name : user.username;
  let product_price = 0;
  let delivery_price = 4000;
  let voucher_discount = 2000;

  carts.map((cart) => {
    return (product_price += cart.total_price);
  });

  const total_price = product_price + delivery_price - voucher_discount;

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${URL_API}/transaction`,
        {
          total_price: total_price,
          delivery_price,
          address: defaultAddress.address,
          city_id: defaultAddress.city_id,
          store_id: store_id,
          voucher_discount,
          courier: "JNE",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Success");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    dispatch(getCart());
    dispatch(getDefaultAddress(user.id));
  }, []);

  return (
    <Box>
      <Box>
        <Flex
          bg={"white"}
          color={"#1c1c1c"}
          minH={"60px"}
          borderBottom={1}
          borderStyle={"solid"}
          borderColor={"#D7F0AA"}
          align={"center"}
        >
          <Box w={"full"} my={"16px"} mx={{ base: "16px", lg: "100px" }}>
            <Flex
              justifyContent={{ base: "center", lg: "flex-start" }}
              align={"center"}
            >
              <div style={{ width: "184px" }}>
                <Image
                  onClick={onOpen}
                  src={Logo}
                  h={"28px"}
                  cursor={"pointer"}
                  _hover={{
                    filter: "brightness(70%)",
                    transition: "300ms",
                  }}
                />
              </div>
            </Flex>
          </Box>
        </Flex>
      </Box>
      <Box w={"full"} py={"16px"} px={{ base: "28px", lg: "100px" }}>
        <Text fontSize={{ base: "2xl", lg: "4xl" }} fontWeight={"medium"}>
          Checkout
        </Text>
        <Divider />
        <Box w={"full"} py={4}>
          <Flex gap={8} flexDir={{ base: "column", lg: "row" }}>
            <Box w={{ base: "100%", lg: "70%" }}>
              <Box>
                <Text fontWeight={"bold"} color={"brand.main"}>
                  Shipping Address
                </Text>
                <Divider my={2} />
                <Text fontWeight={"medium"}>{nameExist}</Text>
                <Text my={2}>{user.phone}</Text>
                <Text>
                  {defaultAddress ? (
                    defaultAddress.address
                  ) : (
                    <Spinner size="sm" />
                  )}
                </Text>
                <Text
                  mt={2}
                  fontSize={"sm"}
                  fontStyle={"italic"}
                  color={"gray.500"}
                >
                  *your order will be delivered to your default address
                </Text>
                <Divider my={4} />
                <Text fontWeight={"bold"} mb={2} color={"brand.main"}>
                  Delivery Options
                </Text>
                <Select placeholder="Select delivery option"></Select>
              </Box>
              <Divider my={4} />
              <Text fontWeight={"bold"} mb={2} color={"brand.main"}>
                Product{"("}s{")"} you purchased
              </Text>
              <Box>
                {item.map((products) => {
                  return (
                    <Box>
                      <Card
                        mt={"4"}
                        w={"full"}
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
                      </Card>
                    </Box>
                  );
                })}
              </Box>
            </Box>
            <Box
              w={{ base: "100%", lg: "30%" }}
              h={"fit-content"}
              pos={"sticky"}
              top={"20px"}
              rounded={"lg"}
              border={"1px"}
              borderColor={"gray.200"}
              boxShadow={"lg"}
            >
              <Box w={"full"} p={4}>
                <Select placeholder="Save more with discount"></Select>
              </Box>
              <Divider />
              <Box w={"full"} p={4}>
                <Text fontWeight={"bold"} mb={4}>
                  Shopping Summary
                </Text>
                <Flex justifyContent={"space-between"} alignItems={"center"}>
                  <Text>Product price:</Text>
                  <Text> Rp.{product_price}</Text>
                </Flex>
                {delivery_price > 0 && (
                  <Flex justifyContent={"space-between"} alignItems={"center"}>
                    <Text>Shipping fee:</Text>
                    <Text> Rp.{delivery_price}</Text>
                  </Flex>
                )}
                {voucher_discount > 0 && (
                  <Flex justifyContent={"space-between"} alignItems={"center"}>
                    <Text>Voucher Discount:</Text>
                    <Text> -Rp.{voucher_discount}</Text>
                  </Flex>
                )}
                <Divider my={4} bg={"black"} />
                <Flex justifyContent={"space-between"} alignItems={"center"}>
                  <Text fontWeight={"bold"}>Total Payment:</Text>
                  <Text fontWeight={"bold"}> Rp.{total_price}</Text>
                </Flex>
                <Button
                  onClick={handleCheckout}
                  w={"full"}
                  color={"white"}
                  bg={"brand.main"}
                  _hover={{ bg: "brand.hover" }}
                  _active={{ bg: "brand.active" }}
                  mt={8}
                >
                  Checkout
                </Button>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>
      <PlainFooter />
      <ConfirmBackToCart isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default Checkout;
