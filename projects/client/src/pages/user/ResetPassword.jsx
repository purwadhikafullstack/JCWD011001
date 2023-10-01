import React, { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const ResetPassword = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [showNew, setShowNew] = useState(false);
  const handleClickNew = () => setShowNew(!showNew);

  const [showConfirm, setShowConfirm] = useState(false);
  const handleClickConfirm = () => setShowConfirm(!showConfirm);

  const resetPasswordSchema = Yup.object().shape({
    newPassword: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("newPassword"), null], "Password must match"),
  });

  const resetPasswordRequest = async (values) => {
    try {
      const url = window.location.href.split("/");
      const token = url[url.length - 1];
      await axios.patch(`${URL_API}/profile/reset`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        title: "Success",
        description: "Password has been reset",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/signin");
    } catch (error) {
      toast({
        title: "Failed",
        description: error?.response?.data?.message,
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
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: (values) => {
      resetPasswordRequest(values);
    },
  });
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      h={"100vh"}
    >
      <Box
        boxShadow={"lg"}
        rounded={"2xl"}
        w={{ base: "80vw", md: "60vw", lg: "40vw" }}
      >
        <form onSubmit={formik.handleSubmit}>
          <VStack px={10} py={10} w={"full"}>
            <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight={700}>
              Reset Password
            </Text>
            <FormControl
              mb={4}
              w={"100%"}
              isRequired
              isInvalid={
                formik.touched.newPassword && formik.errors.newPassword
              }
            >
              <FormLabel mt={4}>New Password</FormLabel>
              <InputGroup>
                <Input
                  id="newPassword"
                  name="newPassword"
                  rounded={"lg"}
                  type={showNew ? "text" : "password"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.newPassword}
                />
                <InputRightElement width="3.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClickNew}>
                    {showNew ? (
                      <IoEyeOffOutline size={"20px"} />
                    ) : (
                      <IoEyeOutline size={"20px"} />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {formik.touched.newPassword && formik.errors.newPassword && (
                <FormErrorMessage fontSize={"xs"}>
                  {formik.errors.newPassword}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              isRequired
              isInvalid={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
            >
              <FormLabel>Confirm New Password</FormLabel>
              <InputGroup>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  rounded={"lg"}
                  type={showConfirm ? "text" : "password"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                />
                <InputRightElement width="3.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClickConfirm}>
                    {showConfirm ? (
                      <IoEyeOffOutline size={"20px"} />
                    ) : (
                      <IoEyeOutline size={"20px"} />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <FormErrorMessage fontSize={"xs"}>
                    {formik.errors.confirmPassword}
                  </FormErrorMessage>
                )}
            </FormControl>
            <Button
              isLoading={formik.isSubmitting}
              type="submit"
              display={"flex"}
              justifyContent={"center"}
              w={"100%"}
              mt={"6"}
              rounded={"lg"}
              color={"white"}
              bgColor={"brand.main"}
              _hover={{ bgColor: "brand.hover" }}
              _active={{ bgColor: "brand.active" }}
            >
              Save Password
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default ResetPassword;
