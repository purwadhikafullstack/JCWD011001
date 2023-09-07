import { Button, useDisclosure } from "@chakra-ui/react";

import { BsArrowUpRight } from "react-icons/bs";
import ModalChangeName from "./ModalChangeName";
import ModalChangeGender from "./ModalChangeGender";

export default function ButtonChangeGender() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button rightIcon={<BsArrowUpRight />} onClick={onOpen} variant={""}>
        Change
      </Button>
      <ModalChangeGender isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
  );
}
