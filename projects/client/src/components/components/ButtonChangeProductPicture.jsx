import { Box, Button, IconButton, useDisclosure } from "@chakra-ui/react";
import { BiSolidEdit } from "react-icons/bi";
import ChangeProductPicture from "./ChangeProductPicture";
import { useState } from "react";
import { IoPencil } from "react-icons/io5";

export default function ButtonChangeProductPicture({
  item,
  setModalClosedTrigger,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isHovered, setIsHovered] = useState(false);

  const handleModalClose = () => {
    setModalClosedTrigger(true); // Set the trigger when the modal is closed
    onClose();
  };
  return (
    <>
      <Box>
        <Button
          variant={""}
          size={{ base: "xl", lg: "2xl" }}
          borderRadius={"30px"}
          _hover={{ bg: "gray.300", borderRadius: "30px" }}
          onClick={onOpen}
        >
          Change
        </Button>
        <ChangeProductPicture
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={handleModalClose}
          id={item.id}
        />
      </Box>
    </>
  );
}
