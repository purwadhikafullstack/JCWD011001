import { Box, Button, Input, useDisclosure } from "@chakra-ui/react";
import { BsArrowUpRight } from "react-icons/bs";
import ModalChangeBirthdate from "./ModalChangeBirthdate";

export default function ButtonChangeBirthdate() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button rightIcon={<BsArrowUpRight />} onClick={onOpen} variant={""}>
        Change
      </Button>
      <ModalChangeBirthdate isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
  );
}
