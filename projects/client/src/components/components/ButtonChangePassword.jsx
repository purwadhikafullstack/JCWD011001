import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { BsArrowUpRight } from "react-icons/bs";
import ModalChangePassword from "./ModalChangePassword";
export default function ButtonChangePassword() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box>
        <Button rightIcon={<BsArrowUpRight />} onClick={onOpen} variant={""}>
          Change
        </Button>
        <ModalChangePassword
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
        />
      </Box>
    </>
  );
}
