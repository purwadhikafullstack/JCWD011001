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
  const handleSetDetail = () => {
    setDetail(false);
  };
  return (
    <Box>
      <Navbar />
      <Text ml={"96px"} mt={"24px"} fontSize={"48px"} borderBottomColor={"red"} border={"10px"}>
        Order
      </Text>
      <Stack align={"center"}>
        <Tabs isFitted variant="enclosed" w={"50%"} isLazy>
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
      </Stack>{" "}
    </Box>
  );
};

export default UserOrder;
