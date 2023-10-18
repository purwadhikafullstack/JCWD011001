import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";

import ButtonSignIn from "./ButtonSignIn";
import ButtonRegist from "./ButtonRegist";
//   import { Link } from "react-scroll";

export default function Hamburger() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  return (
    <>
      <Box className="hamburger">
        <IconButton
          icon={<GiHamburgerMenu />}
          onClick={onOpen}
          variant={""}
          //   bgColor={"#073b4c"}
          ref={btnRef}
        ></IconButton>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="top"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent h={"100px"}>
          <DrawerCloseButton />
          <DrawerBody>
            <Flex mt={"20px"}>
              <Box>
                <ButtonSignIn />
              </Box>
              <Box ml={10}>
                <ButtonRegist />
              </Box>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
