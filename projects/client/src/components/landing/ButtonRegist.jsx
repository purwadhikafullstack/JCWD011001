import { Button } from "@chakra-ui/react";

export default function ButtonRegist() {
  return (
    <>
      <Button
        as={"a"}
        display={"inline-flex"}
        fontSize={"sm"}
        fontWeight={700}
        color={"white"}
        bg={"#37630A"}
        rounded={"lg"}
        href={"/sign-up"}
        _hover={{
          bg: "#457811",
        }}
        _active={{
          bg: "#2D5406",
        }}
      >
        Register
      </Button>
    </>
  );
}
