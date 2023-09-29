import { Box, Flex, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  IoPersonOutline,
  IoCartOutline,
  IoGridOutline,
  IoBarChartOutline,
} from "react-icons/io5";
import NavbarAdmin from "../../components/admin/NavbarAdmin";
import MenuDashboard from "../../components/admin/MenuDashboard";
import AdminManagement from "../../components/admin/super/AdminManagement";
import Transaction from "../../components/admin/super/Transaction";
import StockHistory from "../../components/admin/super/StockHistory";
import SalesReport from "../../components/admin/super/SalesReport";

const SuperDashboard = () => {
  const [activePage, setActivePage] = useState("admin");
  const renderPage = () => {
    switch (activePage) {
      case "admin":
        return <AdminManagement />;
      case "transaction":
        return <Transaction />;
      case "stock":
        return <StockHistory />;
      case "report":
        return <SalesReport />;
      default:
        return null;
    }
  };
  return (
    <Box>
      <NavbarAdmin title="Admin Dashboard" />
      <Flex flexDir={{ base: "column", md: "row" }}>
        <Box
          w={{ base: "100%", md: "400px" }}
          bg={"brand.main"}
          color="white"
          minH={{ md: "100vh" }}
          mt={"60px"}
        >
          <Stack
            spacing="2"
            direction={{ base: "row", md: "column" }}
            w={"full"}
          >
            <MenuDashboard
              onClick={() => setActivePage("admin")}
              icon={IoPersonOutline}
              name="Admin Management"
            />
            <MenuDashboard
              onClick={() => setActivePage("transaction")}
              icon={IoCartOutline}
              name="Transaction"
            />
            <MenuDashboard
              onClick={() => setActivePage("stock")}
              icon={IoGridOutline}
              name="Stock History"
            />
            <MenuDashboard
              onClick={() => setActivePage("report")}
              icon={IoBarChartOutline}
              name="Sales Report"
            />
          </Stack>
        </Box>
        <Box w={"full"} mt={{ base: "20px", md: "60px" }}>
          {renderPage()}
        </Box>
      </Flex>
    </Box>
  );
};

export default SuperDashboard;
