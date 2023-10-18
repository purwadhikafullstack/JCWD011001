import { Button, FormControl, FormErrorMessage, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast } from '@chakra-ui/react';
import * as Yup from "yup";
import axios from "axios";
import React from "react";
import { useFormik } from "formik";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const ForgotPassword = ({ isOpen, onClose }) => {
    const toast = useToast();
    const validationSchema = Yup.object().shape({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    });

    const forgotPasswordRequest = async (values, formik) => {
        try {
          await axios.put(`${URL_API}/profile/forgot`, values);
          toast({
            title: "Request accepted. Check your email to reset your password",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          formik.resetForm();
          onClose();
        } catch (error) {
          toast({
            title: "Failed",
            description: error.response.data.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } finally {
          formik.setSubmitting(false);
        }
    };

    const formik = useFormik({
      initialValues: {
        email: "",
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        forgotPasswordRequest(values, formik);
      },
    });
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize={"2xl"} fontWeight={700}>
            Forgot your password?
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <Text fontSize={"sm"} mb={4} fontWeight={400} color={"gray.600"}>
              Enter the email address you used when you joined and we'll send
              you a link to reset your password.
            </Text>

            <FormControl
              isRequired
              isInvalid={formik.touched.email && formik.errors.email}
            >
              <Input
                id="email"
                name="email"
                type="email"
                rounded={"lg"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                focusBorderColor={"brand.main"}
                placeholder="yours@email.com"
              />
              {formik.touched.email && formik.errors.email && (
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={formik.isSubmitting}
              type="submit"
              display={"flex"}
              justifyContent={"center"}
              w={"100%"}
              rounded={"lg"}
              color={"white"}
              bgColor={"brand.main"}
              _hover={{ bgColor: "brand.hover" }}
              _active={{ bgColor: "brand.active" }}
            >
              Send Request
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default ForgotPassword