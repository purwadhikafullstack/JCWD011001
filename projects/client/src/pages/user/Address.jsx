import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  useDisclosure,
  Stack,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import Navbar from "../../components/landing/Navbar";
import AddAddressModal from "../../components/user/AddAddressModal";
import {
  IoAddOutline,
  IoTrashOutline,
  IoCreateOutline,
  IoStar,
  IoStarOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  getAddress,
  getAddressById,
  setPrimaryAddress,
} from "../../redux/reducer/AddressReducer";
import DeleteAddressModal from "../../components/user/DeleteAddressModal";
import EditAddressModal from "../../components/user/EditAddressModal";

function Address() {
  const [addressToDeleteId, setAddressToDeleteId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const dispatch = useDispatch();
  const toast = useToast();

  const { user } = useSelector((state) => state.AuthReducer);
  const { initialAddress } = useSelector((state) => state.AddressReducer);

  const id = user.id;

  useEffect(() => {
    if (addressToDeleteId) {
      dispatch(getAddressById(addressToDeleteId));
    }
  }, [addressToDeleteId, dispatch]);

  useEffect(() => {
    dispatch(getAddress(id));
  }, []);

  const handleDefault = async (address_id) => {
    let defaultAddress = userAddress.find((address) => address.isdefault);

    if (!defaultAddress) {
      setPrimaryAddress(address_id, toast);
      defaultAddress = userAddress.find(async (address) => await address.isdefault);
    }

    await dispatch(setPrimaryAddress(address_id, toast));
    await dispatch(getAddress(id));
  };

  const userAddress = useSelector((state) => state.AddressReducer.userAddress);

  return (
    <Box>
      <Navbar />
      <Box
        w={"full"}
        py={"16px"}
        px={{ base: "28px", md: "48px", lg: "100px" }}
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight={"medium"}>
            Address
          </Text>
          <Button
            onClick={onOpen}
            size={{ base: "sm", md: "md" }}
            rounded={"lg"}
            bg={"brand.main"}
            color={"white"}
            _hover={{ bg: "brand.hover" }}
            _active={{ bg: "brand.active" }}
          >
            <IoAddOutline size={20} />
            Add Address
          </Button>
        </Box>
        <Box mt={4}>
          <Text color={"gray.500"} fontStyle={"italic"}>
            Click star to set address as default. Filled star indicates it
          </Text>
          <Stack mt={2} spacing={4}>
            {userAddress.map((address) => (
              <Box
                key={address.id}
                display={"flex"}
                flexDir={{ base: "column", md: "row" }}
                justifyContent={{ base: "flex-start", md: "space-between" }}
                p={4}
                gap={4}
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="md"
              >
                <Box display={"flex"} alignItems={"center"} gap={4}>
                  <Text>{address.address}</Text>
                </Box>
                <Box gap={4}>
                  <IconButton
                    variant={"ghost"}
                    icon={address.isdefault ? <IoStar /> : <IoStarOutline />}
                    size={"md"}
                    colorScheme="yellow"
                    rounded={"full"}
                    onClick={() => {
                      if (!address.isdefault) {
                        handleDefault(address.id);
                      }
                    }}
                  />
                  <IconButton
                    variant={"ghost"}
                    icon={<IoCreateOutline />}
                    aria-label="Edit"
                    size={"md"}
                    colorScheme="green"
                    rounded={"full"}
                    onClick={() => {
                      setAddressToDeleteId(address.id);
                      onOpenEdit();
                    }}
                  />
                  <IconButton
                    variant={"ghost"}
                    icon={<IoTrashOutline />}
                    aria-label="Delete"
                    size={"sm"}
                    colorScheme="red"
                    rounded={"full"}
                    onClick={() => {
                      setAddressToDeleteId(address.id);
                      onOpenDelete();
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
      <AddAddressModal isOpen={isOpen} onClose={onClose} />
      <DeleteAddressModal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        address_id={addressToDeleteId}
      />
      <EditAddressModal
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        address_id={addressToDeleteId}
        initialAddress={initialAddress}
      />
    </Box>
  );
}

export default Address;
