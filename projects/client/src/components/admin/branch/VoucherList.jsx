import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminVoucher } from "../../../redux/reducer/VoucherReducer";
import {
  Box,
  Flex,
  IconButton,
  Tag,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { IoTrashOutline } from "react-icons/io5";
import DeleteVoucherModal from "./DeleteVoucherModal";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const VoucherList = () => {
  const dispatch = useDispatch();
  const [voucherId, setVoucherId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const adminVoucherList = useSelector(
    (state) => state.VoucherReducer.adminVoucher
  );

  useEffect(() => {
    dispatch(getAdminVoucher());
  }, [dispatch]);

  const isExpired = (dateString) => {
    const currentDate = new Date();
    const expiredDate = new Date(dateString);
    return expiredDate < currentDate;
  };

  const sortedAdminVoucherList = [...adminVoucherList].sort((a, b) => {
    const dateA = new Date(a.expired);
    const dateB = new Date(b.expired);
    return dateB - dateA;
  });

  return (
    <Box px={8} py={4}>
      <Flex gap={4} wrap={"wrap"}>
        {sortedAdminVoucherList.map((voucher) => (
          <Box
            key={voucher.id}
            bg={"white"}
            rounded={"lg"}
            p={4}
            boxShadow={"lg"}
            w={{ base: "100%", lg: "31%" }}
          >
            <Text mb={4} fontSize={"lg"} fontWeight={"bold"}>
              {voucher.name}
            </Text>
            <Tag bg={"green.100"} rounded={"full"}>
              {voucher.type}
            </Tag>
            <Text my={4} color={"gray.500"}>
              {voucher.description}
            </Text>
            <Flex justify={"space-between"} alignItems={"center"}>
              <Text
                color={isExpired(voucher.expired) ? "red" : "inherit"}
              >
                Expired: {formatDate(voucher.expired)}
              </Text>
              <IconButton
                variant={"ghost"}
                icon={<IoTrashOutline />}
                aria-label="Delete"
                size={"md"}
                colorScheme="red"
                rounded={"full"}
                onClick={() => {
                  setVoucherId(voucher.id);
                  onOpen();
                }}
              />
            </Flex>
          </Box>
        ))}
      </Flex>
      <DeleteVoucherModal isOpen={isOpen} onClose={onClose} id={voucherId} />
    </Box>
  );
};

export default VoucherList;