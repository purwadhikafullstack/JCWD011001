import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Icon,
  Image,
  Stack,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  Stepper,
  Text,
  useSteps,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import getImage from "../../utils/getImage";

const UserOrderFinishedCardDetails = ({ transactionDetail, transactionProducts }) => {
  const orderStatusArray = [
    { status: "Awaiting Payment", color: "red" },
    { status: "Waiting for Payment Confirmation", color: "orange" },
    { status: "Processing", color: "orange" },
    { status: "Shipped", color: "green" },
    { status: "Confirm Your Order", color: "green" },
    { status: "Canceled", color: "red" },
    { status: "Finished", color: "Green" },
  ];


  const RenderStatus = () => {
    if (transactionDetail.status === 6)
      return (
        <Flex direction="column" alignItems="center" justifyContent="center" h="100%">
          <Icon as={AiOutlineCheckCircle} boxSize={12} color="green.400" />
          <Text fontSize="xl" fontWeight="bold" mt={4}>
            Order Finished
          </Text>
          <Text color="gray.600" mt={2}>
            Your order has been successfully completed.
          </Text>
        </Flex>
      );

    return (
      <Flex direction="column" alignItems="center" justifyContent="center" h="100%">
        <Icon as={AiOutlineCloseCircle} boxSize={12} color="red.400" />
        <Text fontSize="xl" fontWeight="bold" mt={4}>
          Order Cancelled
        </Text>
        <Text color="gray.600" mt={2}>
          Your order has been cancelled.
        </Text>
      </Flex>
    );
  };

  return (
    <Card>
      <CardHeader fontSize={"25px"} borderBottomColor={"red"}>
        Order #{`${transactionDetail.user_id}${transactionDetail.id}`}
        <Box borderBottom="2px solid #E2E8F0" mt={4} />
      </CardHeader>
      <CardBody>
        {transactionProducts.length > 0 &&
          transactionProducts.map((item) => (
            <Box key={item.id}>
              <Flex justify={"space-between"}>
                <Stack spacing="2">
                  <Text fontWeight={"bold"} fontSize={"20px"}>
                    {item?.Product?.name}
                  </Text>
                  <Text>Rp.{item.price},-</Text>
                  <Text mt={"45%"}>Quantity {item?.quantity}</Text>
                </Stack>
                <Box w={{ base: "50%", md: "30%" }} align={"right"}>
                  <Image
                    src={getImage(item.Product.product_img) || null}
                    fit={"contain"}
                    w={"100%"}
                    overflow={"hidden"}
                    loading="lazy"
                  />
                </Box>
              </Flex>
              <Box borderBottom="2px solid #E2E8F0" my={4} />
            </Box>
          ))}
        <Box width={"100%"}>
          <Text>
            Send to: "<b>{transactionDetail.address}</b>"
          </Text>

          <Box py="40px">{RenderStatus()}</Box>
        </Box>
      </CardBody>
    </Card>
  );
};

export default UserOrderFinishedCardDetails;
