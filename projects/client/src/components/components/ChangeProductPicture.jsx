import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const ChangeProductPicture = ({ isOpen, onClose, id }) => {
  const toast = useToast();
  const [productPicture, setProductPicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");


  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setProductPicture(null);
      setError("No profile photo selected.");
      return;
    }

    if (file.size > 1024 * 1024) {
      setProductPicture(null);
      setError("Please select an image file with a maximum size of 1 MB.");
      return;
    }

    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));
    if (!allowedExtensions.includes(fileExtension)) {
      setProductPicture(null);
      setError(
        "Please select an image file with a valid extension (jpg, jpeg, png, gif)."
      );
      return;
    }

    setProductPicture(file);
    setError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!productPicture) {
      toast({
        title: "Error",
        description: "Please select an image file.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("product_img", productPicture);
    try {
      await axios.patch(`${URL_API}/product/picture/${id}`, formData);
      toast({
        title: "Success",
        description: "Profile photo updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      //   setTimeout(() => {
      //     window.location.reload();
      //   }, 1000);
    } catch (error) {
      console.log("Error uploading profile photo:", error);
      toast({
        title: "Failed",
        description: error?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize={"xl"} fontWeight={700}>
            Change Product Picture
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Upload Photo</FormLabel>
            <Input
              type="file"
              accept=".jpg, .jpeg, .png, .gif"
              onChange={handleImageUpload}
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                style={{ marginTop: "10px", width: "100%" }}
              />
            )}
            {error && <Text color="red">{error}</Text>}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleSave}
            display={"flex"}
            justifyContent={"center"}
            w={"100%"}
            rounded={"lg"}
            color={"white"}
            bgColor={"brand.main"}
            _hover={{ bgColor: "brand.hover" }}
            _active={{ bgColor: "brand.active" }}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangeProductPicture;
