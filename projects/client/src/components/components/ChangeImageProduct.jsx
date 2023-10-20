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
import getImage from "../../utils/getImage";
const URL_API = process.env.REACT_APP_API_BASE_URL;

export default function ChangeImageProduct({ isOpen, onClose }) {
  const [product, setProduct] = useState([]);

  const fetchData = async () => {
    const response = await axios.get(`${URL_API}/product`);
    setProduct(response.data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);
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
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
