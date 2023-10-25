import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Input, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import BranchSalesReportMonthStatistic from "./BranchSalesReportMonthStatistic";
import { useSelector } from "react-redux";
import axios from "axios";
import BranchSalesReportUser from "./BranchSalesReportUser";
import BranchSalesReportProduct from "./BranchSalesReportProduct";
import BranchSalesReportTransaction from "./BranchSalesReportTransaction";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const BranchSalesReport = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [storeData, setStoreData] = useState({});
  const [order, setOrder] = useState("DESC");
  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${URL_API}/report/${storeData.id}`);
      await setData(data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchStore = async () => {
    try {
      const { data } = await axios.get(`${URL_API}/report/store`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      await setStoreData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStore();
  }, []);

  useEffect(() => {
    if (storeData.id) {
      fetchData();
    }
  }, [storeData]);

  return (
    <Box w={"full"} minH={"100vh"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={"#D7F0AA"}
        py={4}
        px={8}>
        <Box>
          <Text fontSize={{ base: "xl", lg: "2xl" }} fontWeight={"medium"}>
            Sales Report {storeData.name}
          </Text>
        </Box>
      </Box>
      <BranchSalesReportMonthStatistic data={data} />
      <Box px={8}>
        <Flex gap={"8px"} mt={4}>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            w={{ base: "30%", md: "20%" }}
          />
          <Text mt={2}>to</Text>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            w={{ base: "30%", md: "20%" }}
          />
          <Button onClick={() => setOrder(order === "DESC" ? "ASC" : "DESC")} colorScheme="green">
            {order}
          </Button>{" "}
        </Flex>
        <Tabs isFitted variant={"solid-rounded"} mt={4} isLazy>
          <TabList mb="1em">
            <Tab _selected={{ color: "white", bg: "green.500" }}>User</Tab>
            <Tab _selected={{ color: "white", bg: "green.500" }}>Product</Tab>
            <Tab _selected={{ color: "white", bg: "green.500" }}>Transaction</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <BranchSalesReportUser
                id={storeData.id}
                orderState={{ order, setOrder }}
                startDateState={{ startDate, setStartDate }}
                endDateState={{ endDate, setEndDate }}
              />
            </TabPanel>
            <TabPanel>
              <BranchSalesReportProduct
                id={storeData.id}
                orderState={{ order, setOrder }}
                startDateState={{ startDate, setStartDate }}
                endDateState={{ endDate, setEndDate }}
              />
            </TabPanel>
            <TabPanel>
              <BranchSalesReportTransaction
                id={storeData.id}
                orderState={{ order, setOrder }}
                startDateState={{ startDate, setStartDate }}
                endDateState={{ endDate, setEndDate }}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default BranchSalesReport;
