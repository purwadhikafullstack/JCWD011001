import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo_main.png";
import { HiOutlineSearch, HiOutlineShoppingCart } from "react-icons/hi";
import Hamburger from "./Hamburger";
import ButtonSignIn from "./ButtonSignIn";
import ButtonRegist from "./ButtonRegist";
import { useDispatch } from "react-redux";
import { logoutAuth, logoutSuccess } from "../../redux/reducer/AuthReducer";

const Navbar = () => {
  const login = localStorage.getItem("token");
  const [cartItemCount, setCartItemCount] = useState(0);
  const location = useLocation();
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  function onKlik() {
    dispatch(logoutAuth(toast));
  }

  const [isLargerThanMD] = useMediaQuery("(min-width: 768px)");
  return (
    <header>
      <Box>
        <Flex
          bg={"white"}
          color={"#1c1c1c"}
          minH={"60px"}
          borderBottom={1}
          borderStyle={"solid"}
          borderColor={"#D7F0AA"}
          align={"center"}
        >
          <Box w={"50%"} m={"16px 100px"}>
            <Flex justifyContent={"flex-start"} align={"center"}>
              <Link to={"/"}>
                <div style={{ width: "184px" }}>
                  <Image
                    src={Logo}
                    h={"28px"}
                    _hover={{ filter: "brightness(70%)", transition: "300ms" }}
                  />
                </div>
              </Link>
              <Text ml={8} fontWeight={"medium"} _hover={{ color: "#1c1c1c" }}>
                <Link
                  to={"/"}
                  style={{
                    color: location.pathname === "/" ? "#59981A" : "inherit",
                  }}
                >
                  Home
                </Link>
              </Text>
              <Link
                to={"/shop"}
                style={{
                  color: location.pathname === "/shop" ? "#59981A" : "inherit",
                }}
              >
                <Text ml={4} fontWeight={"medium"}>
                  Shop
                </Text>
              </Link>
              <Link
                to={"/about"}
                style={{
                  color: location.pathname === "/about" ? "#59981A" : "inherit",
                }}
              >
                <Text ml={4} fontWeight={"medium"}>
                  About
                </Text>
              </Link>
              <Link
                to={"/store"}
                style={{
                  color: location.pathname === "/store" ? "#59981A" : "inherit",
                }}
              >
                <Text ml={4} fontWeight={"medium"}>
                  Store
                </Text>
              </Link>
            </Flex>
          </Box>
          <Box w={"50%"} m={"16px 100px"}>
            <Flex justifyContent={"flex-end"} align={"center"} gap={4}>
              <Link to={"/search"}>
                <HiOutlineSearch
                  fontSize={24}
                  cursor={"pointer"}
                  color={"gray.800"}
                />
              </Link>
              <Link to={"/cart"} ml={4}>
                <Flex alignItems={"center"} position="relative">
                  <HiOutlineShoppingCart
                    fontSize={24}
                    cursor={"pointer"}
                    color={"gray.800"}
                  />
                  <Box
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    bg="red"
                    color="white"
                    borderRadius="100%"
                    width={`${cartItemCount.toString().length * 10 + 8}px`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize={"xs"}>{cartItemCount}</Text>
                  </Box>
                </Flex>
              </Link>
              {login ? (
                <Flex alignItems={"center"} ml={10}>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={"full"}
                      variant={"link"}
                      cursor={"pointer"}
                      minW={0}
                    >
                      <Avatar size={"sm"} name="User" src={"/profile"} />
                    </MenuButton>
                    <MenuList>
                      <Link to={"/profile"}>
                        <MenuItem>Profile</MenuItem>
                      </Link>
                      <Link to={"/change-password"}>
                        <MenuItem>Change Password</MenuItem>
                      </Link>
                      <MenuDivider />
                      <Link>
                        <MenuItem color={"red"} onClick={() => onKlik()}>
                          Sign Out
                        </MenuItem>
                      </Link>
                    </MenuList>
                  </Menu>
                </Flex>
              ) : (
                <Box ml={10}>
                  <Stack direction={"row"} spacing={6} ml={4}>
                    <Button
                      as={"a"}
                      display={"inline-flex"}
                      fontSize={"sm"}
                      fontWeight={700}
                      color={"#37630A"}
                      bg={"white"}
                      border={"1px"}
                      borderColor={"#37630A"}
                      rounded={"lg"}
                      onClick={() => {
                        navigate("/signin");
                      }}
                      _hover={{
                        bg: "gray.100",
                      }}
                    >
                      {" "}
                      Log In
                    </Button>
                    <Button
                      as={"a"}
                      display={"inline-flex"}
                      fontSize={"sm"}
                      fontWeight={700}
                      color={"white"}
                      bg={"#37630A"}
                      rounded={"lg"}
                      _hover={{
                        bg: "#457811",
                      }}
                      _active={{
                        bg: "#2D5406",
                      }}
                      onClick={() => {
                        navigate("/register");
                      }}
                    >
                      Register
                    </Button>
                  </Stack>
                </Box>
              )}
            </Flex>
          </Box>
        </Flex>
      </Box>
    </header>
  );
};

export default Navbar;
