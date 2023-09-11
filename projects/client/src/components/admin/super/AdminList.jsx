import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getBranchAdmin } from "../../../redux/reducer/AdminReducer";
import {
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Flex,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoTrashOutline,
} from "react-icons/io5";
import DeleteAdminModal from "./DeleteAdminModal";

const AdminList = () => {
  const [adminToDeleteId, setAdminToDeleteId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const adminList = useSelector((state) => state.AdminReducer.admin);

  const [sortColumn, setSortColumn] = useState("Admin Name");
  const [sortDirection, setSortDirection] = useState("asc");

  const onDelete = () => {
    onOpen();
  };

  useEffect(() => {
    dispatch(getBranchAdmin());
  }, [dispatch]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? (
        <IoChevronDownOutline />
      ) : (
        <IoChevronUpOutline />
      );
    }
    return null;
  };

  const sortedAdminList = [...adminList].sort((a, b) => {
    if (sortColumn === "Admin Name") {
      return sortDirection === "asc"
        ? a.Admin.name.localeCompare(b.Admin.name)
        : b.Admin.name.localeCompare(a.Admin.name);
    } else if (sortColumn === "Email") {
      return sortDirection === "asc"
        ? a.Admin.email.localeCompare(b.Admin.email)
        : b.Admin.email.localeCompare(a.Admin.email);
    } else if (sortColumn === "Branch") {
      return sortDirection === "asc"
        ? a.location.localeCompare(b.location)
        : b.location.localeCompare(a.location);
    }
    return 0;
  });

  return (
    <Box flex={1}>
      <Table variant="simple" colorScheme="green">
        <Thead>
          <Tr>
            <Th onClick={() => handleSort("Admin Name")} cursor="pointer">
              <Flex alignItems={"center"} gap={1}>
                Admin Name {renderSortIcon("Admin Name")}
              </Flex>
            </Th>
            <Th onClick={() => handleSort("Email")} cursor="pointer">
              <Flex alignItems={"center"} gap={1}>
                Email {renderSortIcon("Email")}
              </Flex>
            </Th>
            <Th onClick={() => handleSort("Branch")} cursor="pointer">
              <Flex alignItems={"center"} gap={1}>
                Branch {renderSortIcon("Branch")}
              </Flex>
            </Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedAdminList.map((item) => (
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
