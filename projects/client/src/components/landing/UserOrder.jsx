import { Box, Input, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import Navbar from "./Navbar";
import UserOrderOngoing from "./UserOrderOngoing";
import UserOrderFinished from "./UserOrderFinished";
import { Pagination } from "../components/Pagination";
import { useSelector } from "react-redux";

const UserOrder = () => {
  const { page } = useSelector((state) => state.TransactionReducer);
  const [detail, setDetail] = useState(false);
  const [index, setIndex] = useState(1);
  const handleSetDetail = async () => {
    await setDetail(false);
  };

  return (
    <Box mb={{ base: "4", md: "8" }}>
      <Navbar />
      <Text
        ml={{ base: "24px", md: "96px" }}
        mt={{ base: "12px", md: "24px" }}
        fontSize={{ base: "24px", md: "48px" }}
        borderBottomColor={"red"}
        border={"10px"}>
        Order
      </Text>
      <Stack align={"center"} mt={{ base: "4", md: "8" }}>
        <Tabs isFitted variant="enclosed" w={{ base: "90%", md: "50%" }} isLazy>
          <TabList mb="1em">
            <Tab bg={"red"} color={"white"} onClick={handleSetDetail}>
              Ongoing Order
            </Tab>
            <Tab bg={"green"} color={"white"} onClick={handleSetDetail}>
              Finished Order
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <UserOrderOngoing setDetail={setDetail} detail={detail} index={index} setIndex={setIndex} />
            </TabPanel>
            <TabPanel>
              <UserOrderFinished setDetail={setDetail} detail={detail} index={index} setIndex={setIndex} />
            </TabPanel>
          </TabPanels>
          {!detail && page > 1 && <Pagination page={page} index={index} setIndex={setIndex} />}
        </Tabs>
      </Stack>
    </Box>
  );
};

export default UserOrder;
