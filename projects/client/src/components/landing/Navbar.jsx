import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
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
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo_main.png";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { getItem } from "../../redux/reducer/CartReducer";
import { logoutAuth } from "../../redux/reducer/AuthReducer";
import getImage from "../getImage/getImage";

const Navbar = () => {
  const { item, cart } = useSelector((state) => state.CartReducer);
  const cartItem = item.reduce((total, item) => total + item.quantity, 0);
  const items = cart.reduce((total, item) => total + item.quantity, 0);

  const login = localStorage.getItem("token");
  const [cartItemCount, setCartItemCount] = useState(0);
  const location = useLocation();
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.AuthReducer);
  function onKlik() {
    dispatch(logoutAuth(toast));
  }

  useEffect(() => {
    dispatch(getItem());
  }, []);

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
          <Box></Box>
          <Box w={"50%"} m={"16px 100px"}>
            <Flex justifyContent={"flex-end"} align={"center"} gap={4}>
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
                    width={`${(cartItem || 0).toString().length * 10 + 8}px`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize={"xs"}>{cartItem || 0}</Text>
                  </Box>
                </Flex>
              </Link>
              <Flex alignItems={"center"} ml={8}>
                {login ? (
                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={"full"}
                      variant={"link"}
                      cursor={"pointer"}
                      minW={0}
                    >
                      <Avatar
                        size={"sm"}
                        name={user.username}
                        src={getImage(user.profileimg)}
                        style={{
                          boxShadow: "0 0 0 1px white, 0 0 0 2px #59981A",
                        }}
                      />
                    </MenuButton>
                    <MenuList>
                      <Link to={"/profile"}>
                        <MenuItem>Profile</MenuItem>
                      </Link>
                      <Link to={"/address"}>
                        <MenuItem>Manage Address</MenuItem>
                      </Link>
                      <Link to={"/User-Order"}>
                        <MenuItem>Order List</MenuItem>
                      </Link>
                      <MenuDivider />
                      <Link>
                        <MenuItem color={"red"} onClick={() => onKlik()}>
                          Sign Out
                        </MenuItem>
                      </Link>
                    </MenuList>
                  </Menu>
                ) : (
                  <Menu>
                    <MenuButton
                      as={Button}
                      rounded={"full"}
                      variant={"link"}
                      cursor={"pointer"}
                      minW={0}
                    >
                      <Avatar size={"sm"} />
                    </MenuButton>
                    <MenuList>
                      <Box
                        display={"flex"}
                        flexDir={"column"}
                        px={4}
                        py={2}
                        gap={4}
                      >
                        <Center>
                          <Text fontWeight={"medium"} color={"brand.main"}>
                            Welcome to GrocerEasy
                          </Text>
                        </Center>
                        <Divider />
                        <Button
                          as={"a"}
                          fontSize={"sm"}
                          fontWeight={700}
                          color={"brand.main"}
                          bg={"white"}
                          border={"1px"}
                          borderColor={"brand.main"}
                          rounded={"lg"}
                          onClick={() => {
                            navigate("/signin");
                          }}
                          _hover={{
                            bg: "gray.100",
                          }}
                          _active={{
                            bg: "gray.200",
                          }}
                        >
                          {" "}
                          Sign In
                        </Button>
                        <Button
                          as={"a"}
                          fontSize={"sm"}
                          fontWeight={700}
                          color={"white"}
                          bg={"brand.main"}
                          rounded={"lg"}
                          _hover={{
                            bg: "brand.hover",
                          }}
                          _active={{
                            bg: "brand.active",
                          }}
                          onClick={() => {
                            navigate("/register");
                          }}
                        >
                          Register
                        </Button>
                      </Box>
                    </MenuList>
                  </Menu>
                )}
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </header>
  );
};

export default Navbar;
