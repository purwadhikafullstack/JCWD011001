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
import getImage from "../../../utils/getImage";

export default function ProductPicture({ isOpen, onClose, item }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
