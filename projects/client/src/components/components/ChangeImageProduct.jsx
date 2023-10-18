import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ChangeImageProduct({ isOpen, onClose }) {
  const PUBLIC_URL = "http://localhost:8000";
  const [product, setProduct] = useState([]);

  const fetchData = async () => {
    const response = await axios.get("http://localhost:8000/api/product");
    console.log("respon", response.data);
    setProduct(response.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  const getImage = (image) => {
    return `${PUBLIC_URL}/${image}`;
  };
  console.log("uproduct", product);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bgColor={"yellow"} w={"800px"}>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Text>Change Profile Picture</Text>
              <Box>
                <Flex>
                  <Box>
                    <Image></Image>
                    <Text>Current Picture</Text>
                  </Box>
                  <Box ml={"50px"}>
                    {product.map((item) => {
                      return <Image src={getImage(item.product_img)}></Image>;
                    })}
                    <Text>New Picture</Text>
                  </Box>
                </Flex>
                {/* <Input type="file" variant={"unstyled"} id="file"></Input> */}
                {/* <Button
                    w={"200px"}
                    color={"white"}
                    bgColor="#223256"
                    _hover={{ bgColor: "teal", color: "#223256" }}
                  > */}
                {/* {isLoading ? <Spinner /> : "Change Profile"} */}
                {/* </Button> */}
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
