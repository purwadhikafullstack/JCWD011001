import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBranchDailyOrderData } from "../../../redux/reducer/UserOrderReducer";
import { useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import priceFormatter from "../../../utils/priceFormatter";
import Chart from "chart.js/auto";

const ChartBranch = () => {
  const dispatch = useDispatch();
  const { store_id } = useParams();
  const { branchDailyOrderData } = useSelector(
    (state) => state.UserOrderReducer
  );
  const chartRef = useRef(null);
  const [branchName, setBranchName] = useState("");

  useEffect(() => {
    dispatch(getBranchDailyOrderData(store_id));
  }, [store_id]);

  useEffect(() => {
    if (branchDailyOrderData && Object.keys(branchDailyOrderData).length > 0) {
      const firstDate = Object.keys(branchDailyOrderData)[0];
      const firstBranchData = branchDailyOrderData[firstDate];
      const keys = Object.keys(firstBranchData);
      const currentBranchName = keys.length > 0 ? keys[0] : "";
      setBranchName(currentBranchName);
    }

    if (chartRef && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      chartRef.current.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(branchDailyOrderData),
          datasets: [
            {
              data: Object.values(branchDailyOrderData).map((item) =>
                parseInt(item[branchName], 10)
              ),
              backgroundColor: "#2ecc71",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return priceFormatter(value);
                },
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const value = context.parsed.y;
                  return `${priceFormatter(value)}`;
                },
              },
            },
          },
        },
      });
    }
  }, [branchDailyOrderData, branchName]);

  return (
    <Flex direction="column" align="center" justify="center" p={4}>
      <Text mb={2} fontSize="xl" fontWeight="bold">
        Daily Sales of {branchName}
      </Text>
      <Box
        p={4}
        w={{ base: "95%", lg: "80%" }}
        h={{ lg: "400px" }}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="lg"
      >
        <canvas ref={chartRef}></canvas>
      </Box>
    </Flex>
  );
};

export default ChartBranch;
