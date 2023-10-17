import { Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../../redux/reducer/AdminReducer";
import Swal from "sweetalert2";

const NavbarAdmin = (props) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Happy Weekend Admin!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
    });
    if (result.isConfirmed) {
      dispatch(logoutAdmin(toast));
      Swal.fire("See you!", "We will miss you.", "success");
    }
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
