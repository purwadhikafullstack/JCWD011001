import {
  Avatar,
  AvatarBadge,
  Box,
  Center,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import ChangeProductPicture from "../../components/ChangeProductPicture";
import { useState } from "react";
import { IoPencil } from "react-icons/io5";

export default function ProductPicture({ isOpen, onClose, item }) {
  const PUBLIC_URL = "http://localhost:8000";
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getImage = (image) => {
    return `${PUBLIC_URL}/${image}`;
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius={"40px"}>
          <ModalHeader>{item.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <Image
                src={getImage(item.product_img)}
                alt="sayur"
                w={"500px"}
                h={"400px"}
                borderRadius="lg"
              />
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
              {/* <IconButton
          onClick={onOpen}
          variant={""}
          borderRadius={"30px"}
          _hover={{ bg: "gray.300", borderRadius: "30px" }}
          icon={<IoPencil />}
        /> */}
              {/* {isHovered && (
                  <AvatarBadge
                    onClick={handleOpenModal}
                    as={IconButton}
                    size="lg"
                    bottom="5px"
                    colorScheme="gray"
                    aria-label="Edit Image"
                    icon={<IoPencil />}
                  />
                )}
              </Avatar> */}
              <ChangeProductPicture
                isOpen={isModalOpen}
                onOpen={handleOpenModal}
                onClose={handleCloseModal}
                id={item.id}
              />
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
