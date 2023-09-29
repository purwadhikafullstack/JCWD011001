import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getBranchAdmin } from "../../../redux/reducer/AdminReducer";
import { Box, Table, Thead, Tr, Th, Tbody, Td, Flex, IconButton, useDisclosure } from "@chakra-ui/react";
import { IoChevronDownOutline, IoChevronUpOutline, IoTrashOutline } from "react-icons/io5";
import DeleteAdminModal from "./DeleteAdminModal";

const AdminList = () => {
  const [adminToDeleteId, setAdminToDeleteId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const adminList = useSelector((state) => state.AdminReducer.admin);

  const onDelete = () => {
    onOpen();
  };

  useEffect(() => {
    dispatch(getBranchAdmin());
  }, [dispatch]);

  return (
    <Box w={"full"} minH={"100vh"}>
      <Table variant="simple" colorScheme="green">
        <Thead>
          <Tr>
            <Th>
              <Flex alignItems={"center"} gap={1}>
                Admin Name
              </Flex>
            </Th>
            <Th>
              <Flex alignItems={"center"} gap={1}>
                Email
              </Flex>
            </Th>
            <Th>
              <Flex alignItems={"center"} gap={1}>
                Branch
              </Flex>
            </Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {adminList.map((item) => (
            <Tr key={item.id}>
              <Td>{item.Admin.name}</Td>
              <Td>{item.Admin.email}</Td>
              <Td>{item.location}</Td>
              <Td>
                <IconButton
                  variant={"ghost"}
                  icon={<IoTrashOutline />}
                  aria-label="Delete"
                  size={"sm"}
                  colorScheme="red"
                  rounded={"full"}
                  onClick={() => {
                    setAdminToDeleteId(item.admin_id);
                    onDelete();
                  }}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <DeleteAdminModal
        isOpen={isOpen}
        onClose={onClose}
        admin_id={adminToDeleteId}
      />
    </Box>
  );
};

export default AdminList;
