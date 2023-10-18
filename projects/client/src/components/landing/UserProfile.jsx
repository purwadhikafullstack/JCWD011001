import {
  Avatar,
  AvatarBadge,
  Box,
  Center,
  Divider,
  Flex,
  IconButton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import ButtonChangePassword from "../components/ButtonChangePassword";
import ButtonChangeName from "../components/ButtonChangeName";
import ButtonChangeEmail from "../components/ButtonChangeEmail";
import ButtonChangeGender from "../components/ButtonChangeGender";
import ButtonChangeBirthdate from "../components/ButtonChangeBirthdate";
import { IoPencil } from "react-icons/io5";
import ChangeProfilePicture from "../user/ChangeProfilePicture";
import getImage from "../../utils/getImage";
import { useState } from "react";

export default function UserProfile() {
  const { user } = useSelector((state) => state.AuthReducer);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Navbar />
      <Box>
        <Stack px={"30px"}>
          <Text
            ml={{ base: "30px", lg: "96px" }}
            mt={"24px"}
            fontSize={{ base: "24px", lg: "48px" }}
          >
            Profile Setting
          </Text>
          <Box m={"16px auto"} w={{ base: "100%", lg: "850px" }} px={"20px"}>
            <Box>
              <Avatar
                size={{ base: "xl", md: "2xl" }}
                name={user.username}
                src={getImage(user.profileimg)}
                style={{
                  boxShadow: "0 0 0 2px white, 0 0 0 4px #59981A",
                }}
              >
                <AvatarBadge
                  onClick={onOpen}
                  as={IconButton}
                  size="sm"
                  bottom="5px"
                  colorScheme="gray"
                  aria-label="Edit Image"
                  icon={<IoPencil />}
                />
              </Avatar>
            </Box>
            <Box mt={"30px"}>
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
        <ChangeProfilePicture isOpen={isOpen} onClose={onClose} />
      </Box>
    </>
  );
}
