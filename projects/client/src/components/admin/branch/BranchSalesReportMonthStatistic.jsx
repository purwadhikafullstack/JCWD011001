import {
  Box,
  Divider,
  Flex,
  Select,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import priceFormatter from "../../../utils/priceFormatter";

const BranchSalesReportMonthStatistic = ({ data }) => {
  return (
    <Box>
      <StatGroup>
        <Box
          w={"full"}
          px={8}
          py={8}
          gap={4}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          flexWrap={"wrap"}
        >
          <Stat>
            <Box w={{ base: "150px", md: "200px" }}>
              <StatLabel>Total User Buy</StatLabel>
              <StatNumber color={"brand.main"}>{data.totalUserBuy}</StatNumber>
            </Box>
          </Stat>
          <Stat>
            <Box w={{ base: "150px", md: "200px" }}>
              <StatLabel>Total Product Bought</StatLabel>
              <StatNumber color={"brand.main"}>
                {data.totalProductBuy || 0}
              </StatNumber>
            </Box>
          </Stat>
          <Stat>
            <Box w={{ base: "150px", md: "200px" }}>
              <StatLabel>Most Popular Product</StatLabel>
              <StatNumber color={"brand.main"}>
                {data.mostSoldProduct?.Product.name || "None"}
              </StatNumber>
            </Box>
          </Stat>
          <Stat>
            <Box w={{ base: "150px", md: "200px" }}>
              <StatLabel>Total Sales</StatLabel>
              <StatNumber color={"brand.main"}>
                {priceFormatter(data.data)}
              </StatNumber>
            </Box>
          </Stat>
        </Box>
      </StatGroup>{" "}
      <Divider />
    </Box>
  );
};

export default BranchSalesReportMonthStatistic;
