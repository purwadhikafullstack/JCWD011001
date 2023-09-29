import { Avatar, Box, Button, Flex, Icon, Input, Text, useToast } from "@chakra-ui/react";
import { AiOutlineCheckCircle, AiOutlineClockCircle, AiOutlineCloudUpload } from "react-icons/ai";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BiPackage } from "react-icons/bi";
import React, { useState } from "react";
import { useRef } from "react";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { getTransaction, uploadTransactionImage } from "../../redux/reducer/TransactionReducer";
import { useNavigate } from "react-router-dom";

const UserOrderOngoingCardDetailOrder = ({ status, id, setDetail }) => {
  const fileInputRef = useRef(null);
  const [confirmed, setConfirmed] = useState(false);
  const [imgURL, setImgURL] = useState("");
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  function previewImage() {
    const [file] = document.getElementById("upload-payment").files;

    const schema = Yup.object().shape({
      image: Yup.mixed()
        .required("Please select an image")
        .test("fileSize", "File size is too large", (value) => value && value.size <= 1048576)
        .test(
          "fileType",
          "Invalid file format",
          (value) => value && ["image/jpeg", "image/png", "image/gif"].includes(value.type)
        ),
    });

    schema
      .validate({ image: file })
      .then(() => {
        const objectURL = URL.createObjectURL(file);
        setImgURL(objectURL);
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  const handleConfirm = () => {
    setConfirmed(true);
    if (confirmed) console.log("masuk ke confirm order");
  };

  const handleCancel = () => {
    setConfirmed(false);
  };

  const handleUpload = () => {
    previewImage();
  };

  const handleConfirmPayment = () => {
    const [file] = document.getElementById("upload-payment").files;
    dispatch(uploadTransactionImage(id, file, toast));
    setDetail(false);
  };

  if (status === 0) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" mt={10} gap={3}>
        <Icon as={AiOutlineClockCircle} boxSize={12} color="gray.500" />
        <Text fontSize="xl" fontWeight="bold" mt={4}>
          Waiting for Payment
        </Text>
        <Text color="gray.600" mt={2}>
          Please complete your payment to continue, and upload the Payment information
        </Text>{" "}
        <Button
          variant="outline"
          colorScheme="teal"
          mt={4}
          leftIcon={<Icon as={AiOutlineCloudUpload} />}
          onClick={() => fileInputRef.current.click()}>
          Upload
        </Button>
        {imgURL && <Avatar size="2xl" name="Segun Adebayo" src={imgURL} />}
        <Button variant="solid" colorScheme="teal" mt={4} onClick={handleConfirmPayment}>
          Confirm Payment
        </Button>
        <Input type="file" display="none" ref={fileInputRef} id="upload-payment" onChange={handleUpload} />
      </Flex>
    );
  }
  if (status === 1) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" h="10vh" mt={10}>
        <Icon as={AiOutlineClockCircle} boxSize={12} color="gray.500" />
        <Text fontSize="xl" fontWeight="bold" mt={4}>
          Awaiting Admin Confirmation
        </Text>
        <Text color="gray.600" mt={2}>
          Your request is pending admin approval.
        </Text>
      </Flex>
    );
  }

  if (status === 2) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" h="10vh" mt={10}>
        <Icon as={BiPackage} boxSize={12} color="gray.500" />
        <Text fontSize="xl" fontWeight="bold" mt={4}>
          Your Order is Being Processed
        </Text>
        <Text color="gray.600" mt={2}>
          We're working on your order. It will be ready soon.
        </Text>
      </Flex>
    );
  }

  if (status === 3) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" h="10vh" mt={10}>
        <Icon as={LiaShippingFastSolid} boxSize={12} color="gray.500" />
        <Text fontSize="xl" fontWeight="bold" mt={4}>
          Your Order is Being Shipped
        </Text>
        <Text color="gray.600" mt={2}>
          We're Shipping your order. It will be There Soon.
        </Text>
      </Flex>
    );
  }

  if (status === 4) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" h="100%">
        <Icon as={AiOutlineCheckCircle} boxSize={12} color="green.400" />
        <Text fontSize="xl" fontWeight="bold" mt={4}>
          {confirmed ? "Are You Sure?" : "Confirm Your Order"}
        </Text>
        <Text color="gray.600" mt={2}>
          {confirmed
            ? 'This action cannot be undone. Click "Yes" to confirm or "No" to cancel.'
            : "Review your order details and confirm your purchase."}
        </Text>
        {confirmed ? (
          <Flex mt={4}>
            <Button colorScheme="red" mr={4} onClick={handleCancel}>
              No
            </Button>
            <Button colorScheme="green" onClick={handleConfirm}>
              Yes
            </Button>
          </Flex>
        ) : (
          <Button colorScheme="green" mt={4} leftIcon={<Icon as={AiOutlineCheckCircle} />} onClick={handleConfirm}>
            Confirm Order
          </Button>
        )}
      </Flex>
    );
  }

  return (
    <Box>
      ini daftar status
      <Box></Box>
    </Box>
  );
};

export default UserOrderOngoingCardDetailOrder;
