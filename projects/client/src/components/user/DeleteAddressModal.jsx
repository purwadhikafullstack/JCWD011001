import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAddress, getAddress } from "../../redux/reducer/AddressReducer";

const DeleteAddressModal = ({ isOpen, onClose, address_id }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((state) => state.AuthReducer);

  const id = user.id;

  const handleDelete = async () => {
    await dispatch(deleteAddress(address_id, toast));
    onClose();
    await dispatch(getAddress(id));
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize={"xl"} fontWeight={700}>
            Delete Address
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Once you delete this address, it cannot be undone. Are you sure want
            to delete this address?
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            mr={6}
            variant={"ghost"}
            color={"brand.main"}
            _hover={{ bg: "gray.100" }}
            _active={{ bg: "gray.300" }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color={"white"}
            bg={"brand.main"}
            _hover={{ bg: "brand.hover" }}
            _active={{ bg: "brand.active" }}
          >
            Yes, Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteAddressModal;
