import { Button, useDisclosure } from "@chakra-ui/react";

import { BsArrowUpRight } from "react-icons/bs";
import ModalChangeEmail from "./ModalChangeEmail";

export default function ButtonChangeEmail() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button rightIcon={<BsArrowUpRight />} onClick={onOpen} variant={""}>
        Change
      </Button>
      <ModalChangeEmail isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
  );
}
