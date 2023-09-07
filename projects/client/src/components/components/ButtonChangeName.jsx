import { Button, useDisclosure } from "@chakra-ui/react";

import { BsArrowUpRight } from "react-icons/bs";
import ModalChangeName from "./ModalChangeName";

export default function ButtonChangeName() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button rightIcon={<BsArrowUpRight />} onClick={onOpen} variant={""}>
        Change
      </Button>
      <ModalChangeName isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
  );
}
