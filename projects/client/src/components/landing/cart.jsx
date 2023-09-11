import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  IconButton,
  Image,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { IoTrashOutline } from "react-icons/io5";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
export default function Cart() {
  const { login } = useSelector((state) => state.AuthReducer);
  return (
    <>
      <Navbar />
      {login ? (
        <Box>
          <Stack>
            <Box
              ml={"100px"}
              mt={"48px"}
              fontSize={"2xl"}
              fontWeight={"bold"}
              fontFamily={"montserrat"}
            >
              <Text>Keranjang</Text>
            </Box>
            <Divider colorScheme="blackAlpha"></Divider>
            <Card w={"800px"} ml={"100px"} boxShadow={"lg"}>
              <CardBody>
                <Box fontWeight={"bold"} mb={"24px"}>
                  <Text>Click and Play</Text>
                </Box>
                <Flex>
                  <Box w={"100px"} h={"100px"} bgColor={"gray"}>
                    Image
                  </Box>
                  <Box ml={"32px"}>
                    <Text>
                      konektor converter usb type c to hdmi multiport macbook
                      2016
                    </Text>
                    <Text fontWeight={"bold"}>Rp. 30.000</Text>
                  </Box>
                </Flex>
              </CardBody>
              <CardFooter>
                <Flex justify={"space-between"}>
                  <Box>
                    <IconButton
                      color={"blackAlpha.600"}
                      variant={""}
                      icon={<IoTrashOutline size={"md"} />}
                    />
                  </Box>
                  <Box ml={"600px"}>
                    <ButtonGroup variant={"none"}>
                      <IconButton
                        color={"red"}
                        icon={<AiOutlineMinusCircle />}
                      ></IconButton>
                      <Text fontSize={"2xl"}>1</Text>
                      <IconButton
                        color={"green"}
                        icon={<AiOutlinePlusCircle />}
                      ></IconButton>
                    </ButtonGroup>
                  </Box>
                </Flex>
              </CardFooter>
            </Card>
          </Stack>
        </Box>
      ) : (
        <Box>
          <Text>Please Login Fist</Text>
        </Box>
      )}
    </>
  );
}
