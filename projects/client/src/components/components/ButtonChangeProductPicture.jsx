import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
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
  const PUBLIC_URL = "http://localhost:8000";

  const getImage = (image) => {
    return `${PUBLIC_URL}/${image}`;
  };
  const handleModalClose = () => {
    setModalClosedTrigger(true); // Set the trigger when the modal is closed
    onClose();
  };
  return (
    <>
      <Box>
        {/* <Avatar
          size={{ base: "xl", lg: "2xl" }}
          // name={user.username}
          src={getImage(item.product_img)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            cursor: "pointer",
          }}
        > */}

        <Button
          variant={""}
          borderRadius={"30px"}
          _hover={{ bg: "gray.300", borderRadius: "30px" }}
          onClick={onOpen}
        >
          Change
        </Button>
        {/* <IconButton
          onClick={onOpen}
          variant={""}
          borderRadius={"30px"}
          _hover={{ bg: "gray.300", borderRadius: "30px" }}
          icon={<IoPencil />}
        /> */}
        {/* {isHovered && (
          <AvatarBadge
            onClick={onOpen}
            as={IconButton}
            size="lg"
            bottom="5px"
            colorScheme="gray"
            aria-label="Edit Image"
            icon={<IoPencil />}
          />
        )} */}
        {/* </Avatar> */}
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
