import { Box, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import ChartBranch from './ChartBranch';
import BranchSalesReportMonthStatistic from './BranchSalesReportMonthStatistic';
import axios from 'axios';
const URL_API = process.env.REACT_APP_API_BASE_URL;

const HomeBranchDashboard = () => {
  const [data, setData] = useState([]);
  const [storeData, setStoreData] = useState({});

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
        px={8}
      >
        <Box>
          <Text fontSize={{ base: "xl", lg: "2xl" }} fontWeight={"medium"}>
            Home
          </Text>
        </Box>
      </Box>
      <Box w={"full"}>
        <BranchSalesReportMonthStatistic data={data} />
        <ChartBranch />
      </Box>
    </Box>
  );
}

export default HomeBranchDashboard