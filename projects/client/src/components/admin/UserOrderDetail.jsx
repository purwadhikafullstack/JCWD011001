import {
  Box,
  Divider,
  Flex,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserTransactionItem,
} from "../../redux/reducer/UserOrderReducer";
import orderStatus from "../../utils/orderStatus";
import dateFormatter from "../../utils/dateFormatter";
import getImage from "../../utils/getImage";
import priceFormatter from "../../utils/priceFormatter";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";

const UserOrderDetail = ({ isOpen, onClose, orderId, storeId }) => {
  const dispatch = useDispatch();
  const { orderItem } = useSelector((state) => state.UserOrderReducer);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    dispatch(getUserTransactionItem(orderId));
  }, [orderId, storeId]);

  if (!orderItem) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Box
              w={"full"}
              flexDir={"column"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              py={8}
            >
              <Icon
                as={MdOutlineRemoveShoppingCart}
                boxSize={16}
                color={"gray.400"}
              />
              <Text mt={4} fontSize={"lg"} fontWeight={"bold"}>
                Order not found
              </Text>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent p={4}>
        <ModalHeader>
          <Text fontSize={"xl"} fontWeight={700}>
            Order #{orderItem.user_id}
            {orderItem.id} Detail
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box display={"flex"} flexDir={"column"} gap={4}>
            <Box>
              <Text fontWeight="bold">{orderItem.Store?.name}</Text>
              <Text>{dateFormatter(orderItem.createdAt)}</Text>
              <Text
                fontWeight="bold"
                color={orderStatus[orderItem?.status]?.color}
              >
                {orderStatus[orderItem?.status]?.status}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">User Data:</Text>
              <Text>{orderItem.name}</Text>
              <Text>{orderItem.User?.phone}</Text>
              <Text>{orderItem.address}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Price Data:</Text>
              <Text>Total Price: {priceFormatter(orderItem.total_price)}</Text>
              <Text>
                Delivery Price: {priceFormatter(orderItem.delivery_price)}
              </Text>
              <Text>Discount: {priceFormatter(orderItem.total_discount)}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>Payment Receipt:</Text>
              {orderItem?.transaction_img ? (
                <Image
                  src={getImage(orderItem?.transaction_img)}
                  alt={`Receipt #${orderItem.user_id}${orderItem.id}`}
                  w={"full"}
                />
              ) : (
                <Text fontStyle={"italic"} color={"gray.500"}>
                  {orderItem.name} has not uploaded the receipt
                </Text>
              )}
            </Box>
            <Box>
              <Text fontWeight="bold">Product Data:</Text>
              {orderItem.Transactionitems?.map((transactionItem, index) => {
                const hasDiscount = transactionItem.Product.admin_discount > 0;
                const discountedPrice = hasDiscount
                  ? transactionItem.Product.price -
                    transactionItem.Product.admin_discount
                  : null;

                return (
                  <Box key={transactionItem.id}>
                    <Box display={"flex"} alignItems={"center"} gap={4}>
                      {transactionItem.Product.product_img && (
                        <Image
                          src={getImage(transactionItem.Product.product_img)}
                          alt={transactionItem.Product.name}
                          style={{ maxWidth: "100px", maxHeight: "100px" }}
                        />
                      )}
                      <Box>
                        <Text>{transactionItem.Product.name}</Text>
                        <Text>Qty: {transactionItem.quantity}</Text>
                        {hasDiscount && (
                          <Box display={"flex"} alignItems={"center"} gap={4}>
                            <Text>{priceFormatter(discountedPrice)}</Text>
                            <Text
                              color={"gray.500"}
                              textDecorationLine={"line-through"}
                            >
                              {priceFormatter(transactionItem.Product.price)}
                            </Text>
                          </Box>
                        )}
                        {!hasDiscount && (
                          <Text>
                            {priceFormatter(transactionItem.Product.price)}
                          </Text>
                        )}
                      </Box>
                    </Box>
                    {index < orderItem.Transactionitems.length - 1 && (
                      <Divider my={2} />
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UserOrderDetail;
