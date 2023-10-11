import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
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
import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { rejectUserPayment } from "../../../redux/reducer/AdminReducer";
import { getBranchUserOrder } from "../../../redux/reducer/UserOrderReducer";

const RejectPaymentMessage = ({
  isOpen,
  onClose,
  id,
  index,
  startDate,
  endDate,
  orderBy,
  order,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const validationSchema = Yup.object().shape({
    message: Yup.string().required("Message is required"),
  });

  const formik = useFormik({
    initialValues: {
      message: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(
          rejectUserPayment(values, id, toast, onClose, resetForm)
        ).then(() => {
          dispatch(
            getBranchUserOrder({ index, startDate, endDate, orderBy, order })
          );
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize={"xl"} fontWeight={700}>
            Reject payment confirmation?
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <Text mb={4}>
              Are you sure you want to reject this payment? If yes, please
              provide a message
            </Text>
            <FormControl
              isRequired
              isInvalid={formik.errors.message && formik.touched.message}
            >
              <FormLabel>Message</FormLabel>
              <Input
                name="message"
                type="text"
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.message}</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={6}
              variant={"ghost"}
              color={"brand.main"}
              _hover={{ bg: "gray.100" }}
              _active={{ bg: "gray.300" }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={formik.isSubmitting}
              colorScheme="red"
            >
              Yes, Reject
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default RejectPaymentMessage;
