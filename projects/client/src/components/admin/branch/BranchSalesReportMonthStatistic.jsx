import { Box, Flex, Select, Stat, StatGroup, StatLabel, StatNumber, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const BranchSalesReportMonthStatistic = ({ data }) => {
  return (
    <Box my={"16"} borderBottom={"1px solid #ccc"}>
      <StatGroup pb={"2rem"}>
        <Stat>
          <Flex flexDirection="column" alignItems="center" textAlign="center">
            <StatLabel>Total User Buy</StatLabel>
            <StatNumber>{data.totalUserBuy}</StatNumber>
          </Flex>
        </Stat>
        <Stat>
          <Flex flexDirection="column" alignItems="center" textAlign="center">
            <StatLabel>Total Product Bought</StatLabel>
            <StatNumber>{data.totalProductBuy || 0}</StatNumber>
          </Flex>
        </Stat>
        <Stat>
          <Flex flexDirection="column" alignItems="center" textAlign="center">
            <StatLabel>Most Popular Product</StatLabel>
            <StatNumber>{data.mostSoldProduct?.Product.name || "None"}</StatNumber>
          </Flex>
        </Stat>
        <Stat>
          <Flex flexDirection="column" alignItems="center" textAlign="center">
            <StatLabel>Total Sales</StatLabel>
            <StatNumber>Rp.{data.data},-</StatNumber>
          </Flex>
        </Stat>
      </StatGroup>{" "}
    </Box>
  );
};

export default BranchSalesReportMonthStatistic;
