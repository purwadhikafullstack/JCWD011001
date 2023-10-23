import { Box, Stat, StatGroup, StatLabel, StatNumber } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import priceFormatter from "../../../utils/priceFormatter";
import axios from "axios";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const SalesReportStatistic = () => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const { data } = await axios.get(`${URL_API}/report/all`);
            await setData(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

  return (
    <Box>
      <StatGroup>
        <Box
          w={"full"}
          p={8}
          gap={4}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          flexWrap={"wrap"}
        >
          <Stat>
            <Box w={"200px"}>
              <StatLabel>Total User Buy</StatLabel>
              <StatNumber color={"brand.main"}>{data.totalUserBuy}</StatNumber>
            </Box>
          </Stat>
          <Stat>
            <Box w={"200px"}>
              <StatLabel>Total Product Bought</StatLabel>
              <StatNumber color={"brand.main"}>
                {data.totalProductBuy || 0}
              </StatNumber>
            </Box>
          </Stat>
          <Stat>
            <Box w={"200px"}>
              <StatLabel>Most Popular Product</StatLabel>
              <StatNumber color={"brand.main"}>
                {data.mostSoldProduct?.Product.name || "None"}
              </StatNumber>
            </Box>
          </Stat>
          <Stat>
            <Box w={"200px"}>
              <StatLabel>Total Sales</StatLabel>
              <StatNumber color={"brand.main"}>
                {priceFormatter(data.data)}
              </StatNumber>
            </Box>
          </Stat>
        </Box>
      </StatGroup>
    </Box>
  );
};

export default SalesReportStatistic;
