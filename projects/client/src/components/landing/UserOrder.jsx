import { Box, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import Navbar from "./Navbar";
import UserOrderOngoing from "./UserOrderOngoing";
import UserOrderFinished from "./UserOrderFinished";

const UserOrder = () => {
  const [detail, setDetail] = useState(false);

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
              <UserOrderOngoing setDetail={setDetail} detail={detail} />
            </TabPanel>
            <TabPanel>
              <UserOrderFinished setDetail={setDetail} detail={detail} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>{" "}
    </Box>
  );
};

export default UserOrder;
