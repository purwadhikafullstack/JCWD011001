import { Box, Flex, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import {
  IoPersonOutline,
  IoCartOutline,
  IoGridOutline,
  IoBarChartOutline,
} from "react-icons/io5";
import NavbarAdmin from "../../components/admin/NavbarAdmin";
import MenuDashboard from '../../components/admin/MenuDashboard';
import AdminManagement from '../../components/admin/super/AdminManagement';
import Transaction from '../../components/admin/super/Transaction';
import StockHistory from '../../components/admin/super/StockHistory';
import SalesReport from '../../components/admin/super/SalesReport';

const SuperDashboard = () => {
    const [activePage, setActivePage] = useState("admin");
    const renderPage = () => {
      switch (activePage) {
        case "admin":
          return <AdminManagement /> ;
        case "transaction":
          return <Transaction /> ;
        case "stock":
          return <StockHistory /> ;
        case "report":
          return <SalesReport /> ;
        default:
          return null;
      }
    };
  return (
    <Box>
      <NavbarAdmin title="Admin Dashboard" />
      <Flex flexDir={{ base: "column", md: "row" }}>
        <Box
          w={{ base: "100%", md: "26%" }}
          bg={"brand.main"}
          color="white"
          minH={{ md: "100vh" }}
          mt={"60px"}
        >
          <VStack spacing="2" align="stretch">
            <Link as={"button"} onClick={() => setActivePage("admin")}>
              <MenuDashboard icon={IoPersonOutline} name="Admin Management" />
            </Link>
            <Link as={"button"} onClick={() => setActivePage("transaction")}>
              <MenuDashboard icon={IoCartOutline} name="Transaction" />
            </Link>
            <Link as={"button"} onClick={() => setActivePage("stock")}>
              <MenuDashboard icon={IoGridOutline} name="Stock History" />
            </Link>
            <Link as={"button"} onClick={() => setActivePage("report")}>
              <MenuDashboard icon={IoBarChartOutline} name="Sales Report" />
            </Link>
          </VStack>
        </Box>
        <Box w={"full"} mt={{ base: "20px", md: "60px" }}>
          {renderPage()}
        </Box>
      </Flex>
    </Box>
  );
}

export default SuperDashboard