import { Box, IconButton, useDisclosure } from "@chakra-ui/react";
import { BiSolidEdit } from "react-icons/bi";
import ModalEditProduct from "./ModalEditProduct";

export default function ButtonEditProduct({ id, setModalClosedTrigger, item }) {
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
          icon={<BiSolidEdit />}
          onClick={onOpen}
          borderRadius={"40px"}
          _hover={{ bg: "gray.400", border: "1px", borderRadius: "40px" }}
        />
        <ModalEditProduct
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={handleModalClose}
          id={id}
          item={item}
        />
      </Box>
    </>
  );
}
