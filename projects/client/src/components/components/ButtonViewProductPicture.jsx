import { Box, Button, IconButton, useDisclosure } from "@chakra-ui/react";
import { BiSolidEdit } from "react-icons/bi";
import ModalEditProduct from "./ModalEditProduct";
import ProductPicture from "../admin/branch/ProductPicture";

export default function ButtonViewProductPicture({ item }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box>
        <Button
          onClick={onOpen}
          variant={""}
          borderRadius={"40px"}
          _hover={{ bg: "brand.hover", color: "white", borderRadius: "40px" }}
        >
          View
        </Button>
        <ProductPicture
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          item={item}
        />
      </Box>
    </>
  );
}
