import { Box, Text, useMediaQuery } from '@chakra-ui/react';
import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const NavMenu = () => {
    const location = useLocation();
    const [isMobile] = useMediaQuery("(max-width: 768px)");
  return (
    <Box
      display={"flex"}
      flexDir={isMobile ? "column" : "row"}
      justifyContent={"flex-start"}
      align={"center"}
      gap={4}
    >
      <Link
        to={"/"}
        style={{
          color: location.pathname === "/" ? "#59981A" : "inherit",
        }}
      >
        <Text fontWeight={"medium"}>Home</Text>
      </Link>
      <Link
        to={"/shop"}
        style={{
          color: location.pathname === "/shop" ? "#59981A" : "inherit",
        }}
      >
        <Text fontWeight={"medium"}>Shop</Text>
      </Link>
      <Link
        to={"/about"}
        style={{
          color: location.pathname === "/about" ? "#59981A" : "inherit",
        }}
      >
        <Text fontWeight={"medium"}>About</Text>
      </Link>
      <Link
        to={"/store"}
        style={{
          color: location.pathname === "/store" ? "#59981A" : "inherit",
        }}
      >
        <Text fontWeight={"medium"}>Store</Text>
      </Link>
    </Box>
  );
}

export default NavMenu