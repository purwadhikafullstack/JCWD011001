import { Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../../redux/reducer/AdminReducer";

const NavbarAdmin = (props) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const handleLogout = () => {
    dispatch(logoutAdmin(toast));
  };
  return (
    <header>
      <Box>
        <Flex
          pos={"fixed"}
          w={"full"}
          zIndex={10}
          bg={"white"}
          color={"#1c1c1c"}
          minH={"60px"}
          borderBottom={1}
          borderStyle={"solid"}
          borderColor={"#D7F0AA"}
          align={"center"}
          display={"flex"}
          justifyContent={"space-between"}
          px={"8"}
        >
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {props.title}
          </Text>
          <Button
            onClick={handleLogout}
            variant={"ghost"}
            color={"brand.main"}
            _hover={{ bg: "gray.100" }}
            _active={{ bg: "gray.300" }}
          >
            Logout
          </Button>
        </Flex>
      </Box>
    </header>
  );
};

export default NavbarAdmin;
