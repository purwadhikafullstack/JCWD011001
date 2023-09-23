import { Box, Button, Stack, useDisclosure } from "@chakra-ui/react";
import ModalAddProduct from "./ModalAddProduct";
import { BsBagPlus } from "react-icons/bs";

export default function ButtonAddProduct({ setModalClosedTrigger }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleModalClose = () => {
    setModalClosedTrigger(true); // Set the trigger when the modal is closed
    onClose();
  };

  return (
    <>
      <Box>
        <Button
          bg={"brand.main"}
          _hover={{ bg: "brand.hover" }}
          color={"white"}
          onClick={onOpen}
          rightIcon={<BsBagPlus />}
          pos={"absolute"}
          right={10}
          top={90}
        >
          Add Product
        </Button>
        <ModalAddProduct
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={handleModalClose}
        />
      </Box>
    </>
  );
}
