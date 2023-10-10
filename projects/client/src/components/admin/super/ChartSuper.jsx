import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDailyOrderData } from "../../../redux/reducer/UserOrderReducer";
import { Box, Flex, Text } from "@chakra-ui/react";
import priceFormatter from "../../../utils/priceFormatter";
import Chart from "chart.js/auto";

const ChartSuper = () => {
  const dispatch = useDispatch();
  const { dailyOrderData } = useSelector((state) => state.UserOrderReducer);
  const chartRef = useRef(null);

  useEffect(() => {
    dispatch(getDailyOrderData());
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (!dailyOrderData || Object.keys(dailyOrderData).length === 0) {
      return;
    }

    const labels = Object.keys(dailyOrderData);
    const branchNames = Object.keys(dailyOrderData[labels[0]]);
    const branchColors = ["#2ecc71", "#3498db", "#f39c12"];
    const datasets = branchNames.map((branchName, index) => ({
      label: `${branchName}`,
      data: labels.map((date) => dailyOrderData[date][branchName] || 0),
      backgroundColor: branchColors[index],
      borderColor: branchColors[index],
      tension: 0.4,
    }));

    const ctx = document.getElementById("myChart");
    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: datasets,
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

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [dailyOrderData]);

  return (
    <Flex direction="column" align="center" justify="center" p={4}>
      <Text mb={2} fontSize="xl" fontWeight="bold">
        Daily Sales of All Branch
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
        <canvas id="myChart"></canvas>
      </Box>
    </Flex>
  );
};

export default ChartSuper;
