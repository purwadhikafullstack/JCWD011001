import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const URL_API = process.env.REACT_APP_API_BASE_URL;

export default function Verify() {
  const navigate = useNavigate();
  const toast = useToast();
  async function verify() {
    const url = window.location.href.split("/");
    const token = url.pop();
    try {
      const verifyUser = await axios.patch(
        `${URL_API}/auth/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        title: verifyUser?.data.message,
        description: "Happy Shopping",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      // document.location.href("/");
      await navigate("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast({
        title: "Verification Failed",
        description: "Failed",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }
  return (
    <>
      <Box mt={"150px"} ml={"200px"}>
        <Stack>
          <Text fontSize={"6xl"}>Verify your account</Text>
          <Text>
            Thanks for your participation, Click "Hit Me" for verify your
            account
          </Text>
          <Button
            bgColor={"#3e550d"}
            w={"500px"}
            fontSize={"20px"}
            borderRadius={"20px"}
            mt={"10px"}
            color={"white"}
            _hover={{ bgColor: "#5a981b" }}
            onClick={verify}
          >
            Hit Me !
          </Button>
        </Stack>
      </Box>
    </>
  );
}
