import { Box, Button, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react'
import { IoAddOutline } from 'react-icons/io5';
import AddVoucher from './AddVoucher';
import VoucherList from './VoucherList';

const DiscountManagement = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onAdd = () => {
    onOpen();
  };
  return (
    <Box w={"full"} minH={"100vh"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={"#D7F0AA"}
        py={4}
        px={8}
      >
        <Box>
          <Text fontSize={{ base: "xl", lg: "2xl" }} fontWeight={"medium"}>
            Discount Management
          </Text>
        </Box>
        <Box>
          <Button
            onClick={onAdd}
            gap={2}
            rounded={"lg"}
            bg={"brand.main"}
            ml={4}
            color={"white"}
            _hover={{ bg: "brand.hover" }}
            _active={{ bg: "brand.active" }}
          >
            <IoAddOutline size={24} />
            Add Voucher
          </Button>
        </Box>
      </Box>
      <Box w={"full"}>
        <VoucherList />
      </Box>
      <AddVoucher isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}

export default DiscountManagement