import { Button, useDisclosure } from "@chakra-ui/react";
import ChangeImageProduct from "./ChangeImageProduct";

export default function ButtonChangeImageProduct() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Change Image</Button>
      <ChangeImageProduct isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
  );
}
