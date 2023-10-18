import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Input, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import axios from "axios";
import BranchSalesReportMonthStatistic from "../branch/BranchSalesReportMonthStatistic";
import BranchSalesReportUser from "../branch/BranchSalesReportUser";
import BranchSalesReportProduct from "../branch/BranchSalesReportProduct";
import BranchSalesReportTransaction from "../branch/BranchSalesReportTransaction";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const SalesReportSuper = ({ item, handleClickBack }) => {
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
      const { data } = await axios.get(`${URL_API}/store/${item.id}`);
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
    <Stack ml={{ base: "24px", lg: "48px" }} mt={{ base: "8px", lg: "24px" }} mr={"24px"}>
      <Box onClick={handleClickBack} _hover={{ bg: "gray.100" }} cursor={"pointer"}>
        <Text fontSize={{ sm: "24px", md: "32px", lg: "48px" }}>Sales Report {storeData.name}</Text>
      </Box>
      <BranchSalesReportMonthStatistic data={data} />
      <Flex gap={"8px"} mt={4}>
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} w={"10%"} />
        <Text mt={2}>to</Text>
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} w={"10%"} />
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
    </Stack>
  );
};

export default SalesReportSuper;
