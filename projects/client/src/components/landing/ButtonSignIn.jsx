import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function ButtonSignIn() {
  const navigate = useNavigate();
  function toLogin() {
    navigate("/signin");
  }
  return (
    <>
      <Button
        // as={"a"}
        display={"inline-flex"}
        fontSize={"sm"}
        fontWeight={700}
        color={"brand.main"}
        bg={"white"}
        border={"1px"}
        borderColor={"brand.main"}
        rounded={"lg"}
        _hover={{ bgColor: "#457811", color: "white" }}
        onClick={() => toLogin()}
      >
        Sign In
      </Button>
    </>
  );
}
