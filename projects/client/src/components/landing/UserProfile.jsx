import { Box, Divider, Flex, Stack, Text } from "@chakra-ui/react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import ButtonChangePassword from "../components/ButtonChangePassword";
import ButtonChangeName from "../components/ButtonChangeName";
import ButtonChangeEmail from "../components/ButtonChangeEmail";
import ButtonChangeGender from "../components/ButtonChangeGender";
import ButtonChangeBirthdate from "../components/ButtonChangeBirthdate";

export default function UserProfile() {
  const { user } = useSelector((state) => state.AuthReducer);
  return (
    <>
      <Navbar />
      <Box fontFamily={"montserrat"}>
        <Stack>
          <Text ml={"96px"} mt={"24px"} fontSize={"48px"} borderBottomColor={"red"} border={"10px"}>
            Profile Setting
          </Text>
          <Box m={"16px auto"} w={"850px"}>
            <Box>
              <Flex justifyContent={"space-between"}>
                <Text>Username</Text>
                <Text>{user.username}</Text>
              </Flex>
            </Box>
            <Box mt={"30px"}>
              <Flex justifyContent={"space-between"}>
                <Text>Email address</Text>
                <Text>{user.email}</Text>
              </Flex>
            </Box>
            <Box mt={"30px"}>
              <Flex justifyContent={"space-between"}>
                <Text>Gender</Text>
                <Text>{user.gender}</Text>
              </Flex>
            </Box>
            <Box mt={"30px"}>
              <Flex justifyContent={"space-between"}>
                <Text>Birthdate</Text>
                {user.birthdate
                  ? new Date(user.birthdate).toLocaleDateString()
                  : ""}
                {/* <Text>{new Date(user.birthdate).toLocaleDateString()}</Text> */}
              </Flex>
            </Box>
            <Box bgColor={"blackAlpha.800"}>
              <Divider mt={"20px"} />
            </Box>
            <Box mt={"20px"}>
              <Flex justifyContent={"space-between"}>
                <Text>Change Password</Text>
                <ButtonChangePassword />
              </Flex>
            </Box>
            <Box mt={"30px"}>
              <Flex justifyContent={"space-between"}>
                <Text>Change Username</Text>
                <ButtonChangeName />
              </Flex>
            </Box>
            <Box mt={"30px"}>
              <Flex justifyContent={"space-between"}>
                <Text>Change Email</Text>
                <ButtonChangeEmail />
              </Flex>
            </Box>
            <Box mt={"30px"}>
              <Flex justifyContent={"space-between"}>
                <Text>Change Birthdate</Text>
                <ButtonChangeBirthdate />
              </Flex>
            </Box>
            <Box mt={"30px"}>
              <Flex justifyContent={"space-between"}>
                <Text>Change Gender</Text>
                <ButtonChangeGender />
              </Flex>
            </Box>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
