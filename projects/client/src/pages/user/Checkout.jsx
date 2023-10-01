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
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Logo from "../../assets/logo_main.png";
import ConfirmBackToCart from "../../components/user/ConfirmBackToCart";
import { useDispatch, useSelector } from "react-redux";
import { getCart, getItem } from "../../redux/reducer/CartReducer";
import PlainFooter from "../../components/user/PlainFooter";
import axios from "axios";
import { getDefaultAddress } from "../../redux/reducer/AddressReducer";
import DeliveryDetail from "../../components/components/DeliveryDetail";
import ItemCart from "../../components/components/ItemCart";
import TransactionVoucher from "../../components/user/TransactionVoucher";
import { useNavigate } from "react-router-dom";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useSelector((state) => state.AuthReducer);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenVoucher,
    onOpen: onOpenVoucher,
    onClose: onCloseVoucher,
  } = useDisclosure();
  const { defaultAddress } = useSelector((state) => state.AddressReducer);
  const { carts, item } = useSelector((state) => state.CartReducer);
  const { store_id, storeCityId } = useSelector(
    (state) => state.ProductReducer
  );
  const [deliveryDetail, setDeliveryDetail] = useState("");
  const { voucherToUse, deliveryVoucherToUse } = useSelector(
    (state) => state.VoucherReducer
  );
  const [modalClosedTrigger, setModalClosedTrigger] = useState(false);
  const [voucher_discount, setVoucherDiscount] = useState(0);
  const [delivery_discount, setDeliveryDiscount] = useState(0);
  const nameExist = user.name ? user.name : user.username;
  const [totalWeight, setTotalWeight] = useState(0);
  const [deliveryPrice, setDeliveryprice] = useState(0);
  let product_price = 0;
  let delivery_price = 4000;
  let voucher_discount = 2000;
  product_price = carts.total_price;

  const vouchers_discount = voucher_discount + delivery_discount;
  // const total_discount = vouchers_discount;
  let total_price = product_price + delivery_price - vouchers_discount;

  if (total_price < 0) {
    total_price = 0;
  }

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${URL_API}/transaction`,
        {
          name: nameExist,
          total_price,
          delivery_price: deliveryPrice,
          address: defaultAddress.address,
          city_id: defaultAddress.city_id,
          store_id: store_id,
          voucher_discount: vouchers_discount,
          voucher_id: voucherToUse?.id,
          delivery_voucher_id: deliveryVoucherToUse?.id,
          total_discount: vouchers_discount,
          courier: deliveryDetail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        title: "Success",
        description: "Checkout Success",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/User-Order");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(getDefaultAddress(user.id));
    dispatch(getItem(store_id));
    dispatch(getCart());
    if (modalClosedTrigger) {
      dispatch(getCart());
      setModalClosedTrigger(false);
    }
  }, [dispatch, modalClosedTrigger, store_id]);

  console.log("default", defaultAddress);
  console.log("store_id", store_id);
  console.log("city", storeCityId);
  console.log("weight", totalWeight);
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
          <Box w={"full"} my={"16px"} mx={{ base: "16px", md: "100px" }}>
            <Flex
              justifyContent={{ base: "center", md: "flex-start" }}
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
      <Box
        w={"full"}
        py={"16px"}
        px={{ base: "28px", md: "48px", lg: "100px" }}
      >
        <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight={"medium"}>
          Checkout
        </Text>
        <Divider />
        <Box w={"full"} py={4}>
          <Flex gap={8} flexDir={{ base: "column", md: "row" }}>
            <Box w={{ base: "100%", md: "50%", lg: "70%" }}>
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
                  Courier Option:
                </Text>
                <Select
                  placeholder="Select delivery option"
                  onChange={(e) => setDeliveryDetail(e.target.value)}
                >
                  <option value={"jne"}>JNE</option>
                  <option value={"tiki"}>TIKI</option>
                  <option value={"pos"}>POS</option>
                </Select>
                {deliveryDetail === null ? (
                  <div className="spinner"></div>
                ) : deliveryDetail ? (
                  <DeliveryDetail
                    deliveryDetail={deliveryDetail}
                    storeCityId={storeCityId}
                    city_id={defaultAddress.city_id}
                    weight={totalWeight}
                    products={item}
                    setDeliveryprice={setDeliveryprice}
                  />
                ) : null}
              </Box>
              <Divider my={4} />
              <Text fontWeight={"bold"} mb={2} color={"brand.main"}>
                Product{"("}s{")"} you purchased
              </Text>
              <Box>
                {item.map((products) => {
                  return (
                    <ItemCart
                      products={products}
                      key={products.id}
                      setTotalWeight={setTotalWeight}
                      totalWeight={totalWeight}
                    />
                  );
                  // return (
                  //   <Box>
                  //     <Card mt={"4"} w={"full"} boxShadow={"lg"} key={products.id}>
                  //       <CardBody>
                  //         <Box fontWeight={"bold"} mb={"24px"}>
                  //           <Text>Click and Play</Text>
                  //         </Box>
                  //         <Flex>
                  //           <Image
                  //             src="https://cdn10.bigcommerce.com/s-f70ch/products/106/images/307/18__31743.1449827934.1280.1280.jpg?c=2"
                  //             w={"20%"}
                  //           />
                  //           <Box ml={"32px"}>
                  //             <Text>{products.name}</Text>
                  //             <Text fontWeight={"bold"}>Rp. {products.price}</Text>
                  //           </Box>
                  //         </Flex>
                  //       </CardBody>
                  //     </Card>
                  //   </Box>
                  // );
                })}
              </Box>
            </Box>
            <Box
              w={{ base: "100%", md: "50%", lg: "30%" }}
              h={"fit-content"}
              pos={"sticky"}
              top={"20px"}
              rounded={"lg"}
              border={"1px"}
              borderColor={"gray.200"}
              boxShadow={"lg"}
            >
              <Box w={"full"} p={4}>
                <Button
                  onClick={onOpenVoucher}
                  w={"full"}
                  color={"brand.main"}
                  bg={"white"}
                  border={"1px"}
                  borderColor={"brand.main"}
                  rounded={"lg"}
                  _hover={{ bg: "gray.100" }}
                  _active={{ bg: "gray.300" }}
                >
                  Use Voucher
                </Button>
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
                {deliveryPrice > 0 && (
                  <Flex justifyContent={"space-between"} alignItems={"center"}>
                    <Text>Shipping fee:</Text>
                    <Text> Rp.{deliveryPrice}</Text>
                  </Flex>
                )}
                {voucher_discount > 0 && (
                  <Flex justifyContent={"space-between"} alignItems={"center"}>
                    <Text>Voucher Discount:</Text>
                    <Text> -Rp.{voucher_discount}</Text>
                  </Flex>
                )}
                {delivery_discount > 0 && (
                  <Flex justifyContent={"space-between"} alignItems={"center"}>
                    <Text>Delivery Discount:</Text>
                    <Text> -Rp.{delivery_discount}</Text>
                  </Flex>
                )}
                <Divider my={4} bg={"black"} />
                <Flex justifyContent={"space-between"} alignItems={"center"}>
                  <Text fontWeight={"bold"}>Total Payment:</Text>
                  <Text fontWeight={"bold"}>Rp.{total_price}</Text>
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
      <TransactionVoucher
        product_price={product_price}
        delivery_price={delivery_price}
        setVoucherDiscount={setVoucherDiscount}
        setDeliveryDiscount={setDeliveryDiscount}
        setModalClosedTrigger={setModalClosedTrigger}
        isOpen={isOpenVoucher}
        onClose={onCloseVoucher}
      />
    </Box>
  );
};

export default Checkout;
