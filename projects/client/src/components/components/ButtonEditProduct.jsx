import { Box, IconButton, useDisclosure } from "@chakra-ui/react";
import { BiSolidEdit } from "react-icons/bi";
import ModalEditProduct from "./ModalEditProduct";

export default function ButtonEditProduct({ id, setModalClosedTrigger }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleModalClose = () => {
    setModalClosedTrigger(true); // Set the trigger when the modal is closed
    onClose();
  };
  return (
    <>
      <Box>
        <IconButton
          color={"blackAlpha.800"}
          variant={""}
          icon={<BiSolidEdit size={"md"} />}
          onClick={onOpen}
        />
        <ModalEditProduct
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={handleModalClose}
          id={id}
        />
      </Box>
    </>
  );
}
