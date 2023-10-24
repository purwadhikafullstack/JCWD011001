import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineCloudUpload,
} from "react-icons/ai";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BiPackage } from "react-icons/bi";
import React, { useState } from "react";
import { useRef } from "react";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import {
  getTransaction,
  uploadTransactionImage,
} from "../../redux/reducer/TransactionReducer";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { userCancel, userConfirm } from "../../redux/reducer/AuthReducer";
import Swal from "sweetalert2";
import { branchUserCancel } from "../../redux/reducer/AdminReducer";

const UserOrderOngoingCardDetailOrder = ({
  status,
  id,
  setDetail,
  transactionProducts,
}) => {
  const [isHovered, setIsHovered] = useState(false);
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
        .test(
          "fileSize",
          "File size is too large",
          (value) => value && value.size <= 1048576
        )
        .test(
          "fileType",
          "Invalid file format",
          (value) =>
            value &&
            ["image/jpeg", "image/png", "image/gif"].includes(value.type)
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
  };
  const buttonConfirm = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Confirm your order ? ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm order!",
    });
    if (result.isConfirmed) {
      await dispatch(userConfirm(item, Swal));
      await dispatch(getTransaction({}));
      Swal.fire("Confirm!", "The product has been arrived.", "success");
      setDetail(false);
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    }
  };

  const handleCancel = async (item) => {
    // setConfirmed(false);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel order!",
    });
    if (result.isConfirmed) {
      await dispatch(userCancel(item));
      await dispatch(getTransaction({}));
      Swal.fire("Cancel!", "The product has been canceled.", "success");
      setDetail(false);
    }
  };

  const handleDeleteUpload = () => {
    setImgURL("");
  };

  const handleUpload = () => {
    previewImage();
  };

  const handleConfirmPayment = async () => {
    const [file] = document.getElementById("upload-payment").files;
    await dispatch(uploadTransactionImage(id, file, toast));
    await dispatch(getTransaction({}));
    await setDetail(false);
  };

  if (status === 0) {
    return (
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        mt={10}
        gap={3}
      >
        <Icon as={AiOutlineClockCircle} boxSize={12} color="gray.500" />
        <Text fontSize="xl" fontWeight="bold" mt={4}>
          Waiting for Payment
        </Text>
        <Text color="gray.600" mt={2}>
          Please complete your payment to continue, and upload the Payment
          information
        </Text>
        <Text color="gray.600" mt={2}>
          Send the payment to Rek: *-* / BCA CC: Grocer_Easy Team
        </Text>
        <Button
          variant="outline"
          colorScheme="teal"
          mt={4}
          leftIcon={<Icon as={AiOutlineCloudUpload} />}
          onClick={() => fileInputRef.current.click()}
        >
          Upload
        </Button>
        {imgURL && (
          <Box>
            <Avatar
              size="2xl"
              src={imgURL}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              p={2}
            >
              {isHovered && (
                <AvatarBadge
                  onClick={handleDeleteUpload}
                  as={IconButton}
                  size="sm"
                  bottom="5px"
                  colorScheme="gray"
                  aria-label="Edit Image"
                  icon={<IoIosCloseCircleOutline />}
                />
              )}
            </Avatar>
          </Box>
        )}
        <Flex mt={4} gap={2}>
          {imgURL && (
            <Button
              variant="solid"
              colorScheme="teal"
              onClick={handleConfirmPayment}
            >
              Confirm Payment
            </Button>
          )}
          <Input
            type="file"
            display="none"
            ref={fileInputRef}
            id="upload-payment"
            onChange={handleUpload}
          />
          <Button colorScheme="red" onClick={() => handleCancel(id)}>
            Cancel
          </Button>
        </Flex>
      </Flex>
    );
  }
  if (status === 1) {
    return (
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        h="10vh"
        mt={10}
      >
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
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        h="10vh"
        mt={10}
      >
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
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        h="10vh"
        mt={10}
      >
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
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        h="100%"
      >
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
            <Button
              colorScheme="red"
              mr={4}
              onClick={() => setConfirmed(false)}
            >
              No
            </Button>
            <Button colorScheme="green" onClick={() => buttonConfirm(id)}>
              Yes
            </Button>
          </Flex>
        ) : (
          <Button
            colorScheme="green"
            mt={4}
            leftIcon={<Icon as={AiOutlineCheckCircle} />}
            onClick={handleConfirm}
          >
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
