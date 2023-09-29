import { Box, Flex, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  IoCartOutline,
  IoCubeOutline,
  IoPricetagsOutline,
  IoListOutline,
  IoBarChartOutline,
} from "react-icons/io5";
import MenuDashboard from "../../components/admin/MenuDashboard";
import UserTransaction from "../../components/admin/branch/UserTransaction";
import ProductManagement from "../../components/admin/branch/ProductManagement";
import DiscountManagement from "../../components/admin/branch/DiscountManagement";
import CategoryManagement from "../../components/admin/branch/CategoryManagement";
import BranchSalesReport from "../../components/admin/branch/BranchSalesReport";
import NavbarAdmin from "../../components/admin/NavbarAdmin";

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
              onClick={() => setActivePage("transaction")}
              icon={IoCartOutline}
              name="Transaction"
            />
            <MenuDashboard
              onClick={() => setActivePage("product")}
              icon={IoCubeOutline}
              name="Product Management"
            />
            <MenuDashboard
              onClick={() => setActivePage("discount")}
              icon={IoPricetagsOutline}
              name="Discount Management"
            />
            <MenuDashboard
              onClick={() => setActivePage("category")}
              icon={IoListOutline}
              name="Category Management"
            />
            <MenuDashboard
              onClick={() => setActivePage("reports")}
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

export default BranchDashboard;
