import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo_main.png";
import LogoSmall from "../../assets/logo_small.png";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { getItem } from "../../redux/reducer/CartReducer";
import { logoutAuth } from "../../redux/reducer/AuthReducer";
import getImage from "../../utils/getImage";
import NavMenu from "./NavMenu";
import { HiMenu } from "react-icons/hi";
import Swal from "sweetalert2";

const Navbar = () => {
  const { item } = useSelector((state) => state.CartReducer);
  const { store_id } = useSelector((state) => state.ProductReducer);
  const cartItem = item.reduce((total, item) => total + item.quantity, 0);

  const login = localStorage.getItem("token");
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const { user } = useSelector((state) => state.AuthReducer);
  const onKlik = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Thanks for shopping with us!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    });
    if (result.isConfirmed) {
      dispatch(logoutAuth(toast));
      Swal.fire("See you!", "We will miss you.", "success");
    }
  };

  useEffect(() => {
    if (login) dispatch(getItem(store_id));
  }, [store_id]);

  return (
    <header>
      <Box
        py={"16px"}
        px={{ base: "28px", md: "48px", lg: "100px" }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        color={"#1c1c1c"}
        minH={"60px"}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={"#D7F0AA"}>
        <Box>
          <Flex justifyContent={"flex-start"} align={"center"}>
            <Box display={isMobile ? "none" : "block"}>
              <Link to={"/"}>
                <Image mr={8} src={Logo} h={"28px"} _hover={{ filter: "brightness(70%)", transition: "300ms" }} />
              </Link>
            </Box>
            {isMobile ? (
              <Popover>
                <PopoverTrigger>
                  <IconButton
                    color={"brand.main"}
                    bg={"white"}
                    rounded={"full"}
                    icon={<HiMenu size={24} />}
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverBody>
                    <NavMenu />
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            ) : (
              <NavMenu />
            )}
          </Flex>
        </Box>
        <Box display={isMobile ? "block" : "none"}>
          <Link to={"/"}>
            <Image src={LogoSmall} h={"28px"} _hover={{ filter: "brightness(70%)", transition: "300ms" }} />
          </Link>
        </Box>
        <Box>
          <Flex justifyContent={"flex-end"} align={"center"} gap={4}>
            <Link to={"/cart"} ml={4}>
              <Flex alignItems={"center"} position="relative">
                <HiOutlineShoppingCart fontSize={24} cursor={"pointer"} color={"gray.800"} />
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
                  justifyContent="center">
                  <Text fontSize={"xs"}>{cartItem || 0}</Text>
                </Box>
              </Flex>
            </Link>
            <Flex alignItems={"center"} ml={{ base: 2, md: 4}}>
              {login ? (
                <Menu>
                  <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
                    <Avatar
                      size={"sm"}
                      name={user.name}
                      src={getImage(user.profileimg) || null}
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
                  <MenuButton as={Button} rounded={"full"} variant={"link"} cursor={"pointer"} minW={0}>
                    <Avatar size={"sm"} />
                  </MenuButton>
                  <MenuList>
                    <Box display={"flex"} flexDir={"column"} px={4} py={2} gap={4}>
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
                        _hover={{ bg: "gray.100" }}
                        _active={{ bg: "gray.200" }}>
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
                        _hover={{ bg: "brand.hover" }}
                        _active={{ bg: "brand.active" }}
                        onClick={() => {
                          navigate("/register");
                        }}>
                        Register
                      </Button>
                    </Box>
                  </MenuList>
                </Menu>
              )}
            </Flex>
          </Flex>
        </Box>
      </Box>
    </header>
  );
};

export default Navbar;
