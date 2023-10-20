import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import PasswordShow from "./PasswordShow";
import PasswordHide from "./PasswordHide";
import CloseButton from "./CloseButton";
import ChangeButton from "./ChangeButton";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const ChangeSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current Password is required"),
  newPassword: Yup.string()
    .required("Password is required")
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Password must contain at least 8 characters, one uppercase, one number and one special case character"
    ),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("newPassword"), null], "Password must match"),
});

export default function ModalChangePassword({ isOpen, onClose }) {
  const toast = useToast();
  const [show, setShow] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClick = () => setShow(!show);
  const handleClickNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleClickConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const changePassword = async (values) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(`${URL_API}/profile/password`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onClose();
      await Swal.fire("Success!", "Your password has been change", "success");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: ChangeSchema,
    onSubmit: (values) => {
      changePassword(values);
    },
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <form onSubmit={formik.handleSubmit}>
                <FormControl
                  isRequired
                  isInvalid={
                    formik.touched.currentPassword &&
                    formik.errors.currentPassword
                  }
                >
                  <InputGroup mt={"20px"}>
                    <Input
                      placeholder="Current Password"
                      id="currentPassword"
                      name="currentPassword"
                      variant={"flushed"}
                      borderColor={"black"}
                      type={show ? "text" : "password"}
                      value={formik.values.currentPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <InputRightElement>
                      <Button
                        size={"md"}
                        onClick={handleClick}
                        variant={"unstyled"}
                      >
                        {show ? <PasswordShow /> : <PasswordHide />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {formik.touched.currentPassword &&
                    formik.errors.currentPassword && (
                      <FormErrorMessage>
                        {formik.errors.currentPassword}
                      </FormErrorMessage>
                    )}
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={
                    formik.touched.newPassword && formik.errors.newPassword
                  }
                >
                  <InputGroup mt={"20px"}>
                    <Input
                      placeholder="New Password"
                      id="newPassword"
                      name="newPassword"
                      borderColor={"black"}
                      variant={"flushed"}
                      type={showNewPassword ? "text" : "password"}
                      value={formik.values.newPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <InputRightElement>
                      <Button
                        size={"md"}
                        onClick={handleClickNewPassword}
                        variant={"unstyled"}
                      >
                        {showNewPassword ? <PasswordShow /> : <PasswordHide />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {formik.touched.newPassword && formik.errors.newPassword && (
                    <FormErrorMessage>
                      {formik.errors.newPassword}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                >
                  <InputGroup mt={"20px"}>
                    <Input
                      placeholder="Confirm New Password"
                      id="confirmPassword"
                      name="confirmPassword"
                      borderColor={"black"}
                      variant={"flushed"}
                      type={showConfirmPassword ? "text" : "password"}
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <InputRightElement>
                      <Button
                        size={"md"}
                        onClick={handleClickConfirmPassword}
                        variant={"unstyled"}
                      >
                        {showConfirmPassword ? (
                          <PasswordShow />
                        ) : (
                          <PasswordHide />
                        )}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <FormErrorMessage>
                        {formik.errors.confirmPassword}
                      </FormErrorMessage>
                    )}
                </FormControl>
                <ModalFooter>
                  <CloseButton onClose={onClose} />
                  <ChangeButton />
                </ModalFooter>
              </form>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
