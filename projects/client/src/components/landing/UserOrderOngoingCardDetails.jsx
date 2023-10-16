import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
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
import UserOrderOngoingCardDetailOrder from "./UserOrderOngoingCardDetailStatus";
import getImage from "../../utils/getImage";

const UserOrderOngoingCardDetails = ({ transactionDetail, transactionProducts, setDetail }) => {
  const orderStatusArray = [
    { status: "Awaiting Payment", color: "red" },
    { status: "Waiting for Payment Confirmation", color: "orange" },
    { status: "Processing", color: "orange" },
    { status: "Shipped", color: "green" },
    { status: "Confirm Your Order", color: "green" },
  ];

  const RenderStatus = () => {
    const { activeStep } = useSteps({
      index: transactionDetail.status,
      count: orderStatusArray.length,
    });

    const activeStepText = orderStatusArray[activeStep].status;
    const nextStep = orderStatusArray[activeStep + 1]?.status || "Finished";

    return (
      <Stack>
        <Stepper size="lg" colorScheme="green" index={activeStep}>
          {orderStatusArray.map((step, index) => (
            <Step label={step.status} key={index}>
              <StepIndicator>
                <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
              </StepIndicator>
              <StepSeparator _horizontal={{ base: { ml: "0" }, md: { ml: "5" } }} />
            </Step>
          ))}
        </Stepper>
        <Flex justifyContent={"space-between"} flexDirection={{ base: "column", md: "row" }}>
          <Text>
            Step {activeStep + 1}: <b>{activeStepText}</b>
          </Text>
          <Text mt={{ base: "4", md: "0" }}>
            Next Step {activeStep + 2}: <b>{nextStep}</b>
          </Text>
        </Flex>
        <UserOrderOngoingCardDetailOrder
          status={transactionDetail.status}
          transactionProducts={transactionProducts}
          id={transactionDetail.id}
          setDetail={setDetail}
        />
      </Stack>
    );
  };

  console.log(transactionDetail);

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
                    {item.Product.name}
                  </Text>
                  <Text>Rp.{item.price},-</Text>
                  <Text mt={"45%"}>Quantity {item.quantity}</Text>
                </Stack>
                <Box w={"50%"} align={"right"} mr={"20%"}>
                  <Image
                    src={getImage(item.Product.product_img) || null}
                    fit={"contain"}
                    w={"30%"}
                    overflow={"hidden"}
                    loading="lazy"
                  />
                </Box>
              </Flex>
              <Box borderBottom="2px solid #E2E8F0" my={4} />
            </Box>
          ))}
        <Box width={"100%"}>
          <Text fontSize={"25px"}>Track Order</Text>
          <Text>
            Send to: "<b>{transactionDetail.address}</b>"
          </Text>
          <Box py="40px">{RenderStatus()}</Box>
        </Box>
      </CardBody>
    </Card>
  );
};

export default UserOrderOngoingCardDetails;
