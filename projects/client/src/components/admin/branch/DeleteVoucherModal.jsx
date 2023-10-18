import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast } from '@chakra-ui/react';
import React from 'react'
import { useDispatch } from 'react-redux';
import { deleteVoucher, getAdminVoucher } from '../../../redux/reducer/VoucherReducer';

const DeleteVoucherModal = ({ isOpen, onClose, id }) => {
    const dispatch = useDispatch();
    const toast = useToast();

    const handleDelete = async () => {
        await dispatch(deleteVoucher(id, toast));
        onClose();
        await dispatch(getAdminVoucher());
    }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize={"xl"} fontWeight={700}>
            Delete Voucher
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Once you delete this voucher, it cannot be undone. Are you sure
            want to delete this voucher?
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
}

export default DeleteVoucherModal