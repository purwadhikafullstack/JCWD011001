import { Box, Button, Stack, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SalesReportSuper from "./SalesReportSuper";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const SalesReport = () => {
  const [stores, setStores] = useState(null);
  const [detail, setDetail] = useState(null);
  const navigate = useNavigate();

  const handleClickStore = (item) => {
    setDetail(item);
  };

  const handleClickBack = () => {
    setDetail(null);
  };

  const fetchStore = async () => {
    try {
      const { data } = await axios.get(`${URL_API}/store/branch`);
      await setStores(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStore();
  }, []);


  if (detail) {
    return (
      <Box>
        <SalesReportSuper item={detail} handleClickBack={handleClickBack} />
      </Box>
    );
  }

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
            Sales Report
          </Text>
        </Box>
      </Box>
      <Stack
        ml={{ base: "24px", lg: "48px" }}
        mt={{ base: "8px", lg: "24px" }}
        mr={"24px"}
      >
        <Table>
          <Thead>
            <Tr>
              <Th>Store Name</Th>
              <Th>Admin</Th>
            </Tr>
          </Thead>
          <Tbody>
            {stores &&
              stores.map((item, index) => (
                <Tr
                  key={index}
                  onClick={() => handleClickStore(item)}
                  _hover={{ bg: "gray.100" }}
                  cursor={"pointer"}
                >
                  <Td>{item.name}</Td>
                  <Td>{item.Admin.name}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Stack>
    </Box>
  );
};

export default SalesReport;
