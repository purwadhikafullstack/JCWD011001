import { Box, Flex, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import {
  IoCartOutline,
  IoCubeOutline,
  IoPricetagsOutline,
  IoListOutline,
  IoBarChartOutline,
} from "react-icons/io5";
import { Link } from 'react-router-dom';
import MenuDashboard from '../../components/admin/MenuDashboard';
import UserTransaction from '../../components/admin/branch/UserTransaction';
import ProductManagement from '../../components/admin/branch/ProductManagement';
import DiscountManagement from '../../components/admin/branch/DiscountManagement';
import CategoryManagement from '../../components/admin/branch/CategoryManagement';
import BranchSalesReport from '../../components/admin/branch/BranchSalesReport';
import NavbarAdmin from '../../components/admin/NavbarAdmin';

const BranchDashboard = () => {
    const [activePage, setActivePage] = useState("transaction");
    const renderPage = () => {
      switch (activePage) {
        case "transaction":
          return <UserTransaction />;
        case "product":
          return <ProductManagement />;
        case "discount":
          return <DiscountManagement />;
        case "category":
          return <CategoryManagement />;
        case "reports":
          return <BranchSalesReport />;
        default:
          return null;
      }
    };
  return (
    <Box>
      <NavbarAdmin title="Branch Admin Dashboard" />
      <Flex flexDir={{ base: "column", md: "row" }}>
        <Box
          w={{ base: "100%", md: "26%" }}
          bg={"brand.main"}
          color="white"
          minH={{ md: "100vh" }}
          mt={"60px"}
        >
          <VStack spacing="2" align="stretch">
            <Link as={"button"} onClick={() => setActivePage("transaction")}>
              <MenuDashboard icon={IoCartOutline} name="Transaction" />
            </Link>
            <Link as={"button"} onClick={() => setActivePage("product")}>
              <MenuDashboard icon={IoCubeOutline} name="Product Management" />
            </Link>
            <Link as={"button"} onClick={() => setActivePage("discount")}>
              <MenuDashboard icon={IoPricetagsOutline} name="Discount Management" />
            </Link>
            <Link as={"button"} onClick={() => setActivePage("category")}>
              <MenuDashboard icon={IoListOutline} name="Category Management" />
            </Link>
            <Link as={"button"} onClick={() => setActivePage("reports")}>
              <MenuDashboard icon={IoBarChartOutline} name="Sales Report" />
            </Link>
          </VStack>
        </Box>
        <Box w={"full"} mt={{ base: "20px", md:"60px" }}>
          {renderPage()}
        </Box>
      </Flex>
    </Box>
  );
}

export default BranchDashboard