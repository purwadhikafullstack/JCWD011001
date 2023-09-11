import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
// import Navbar from "../Components/navbar/Navbar";
import React from "react";
// import { ArrowForwardIcon } from "@chakra-ui/icons";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { RiEye2Line, RiEyeCloseFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const ChangeSchema = Yup.object().shape({
  currentPassword: Yup.string().required("currentPassword is required"),
  password: Yup.string()
    .required("password is required")
    .matches(
      /^.*(?=.{6,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Password must contain at least  characters, one uppercase, one number and one special case character"
    ),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const URL_API = process.env.REACT_APP_API_BASE_URL;
export default function ModalChangePassword({ isOpen, onClose }) {
  const navigate = useNavigate();
  function toHome() {
    navigate("/");
  }

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const changePassword = async (values) => {
    const token = localStorage.getItem("token");
    console.log("token", token);
    const { currentPassword, password, confirmPassword } = values;
    try {
      const respon = await axios.patch(
        `${URL_API}/auth/password`,
        {
          currentPassword: currentPassword,
          password: password,
          confirmPassword: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(respon);
      toast({
        title: "Password change",
        description: "your password has been change",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        window.location.reload();
      }, 550);
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
      password: "",
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
                      type={show ? "text" : "currentPassword"}
                      value={formik.values.currentPassword}
                      onChange={formik.handleChange}
                    ></Input>
                    <InputRightElement>
                      <Button
                        size={"md"}
                        onClick={handleClick}
                        variant={"unstyled"}
                      >
                        {show ? (
                          <RiEye2Line
                            size={{
                              base: "8px",
                              sm: "12px",
                              md: "16px",
                              lg: "24px",
                            }}
                          />
                        ) : (
                          <RiEyeCloseFill
                            size={{
                              base: "8px",
                              sm: "12px",
                              md: "16px",
                              lg: "40px",
                            }}
                          />
                        )}
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
                  isInvalid={formik.touched.password && formik.errors.password}
                >
                  <InputGroup mt={"20px"}>
                    <Input
                      placeholder="New Password"
                      id="password"
                      name="password"
                      borderColor={"black"}
                      variant={"flushed"}
                      type={show ? "text" : "password"}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                    ></Input>
                    <InputRightElement>
                      <Button
                        size={"md"}
                        onClick={handleClick}
                        variant={"unstyled"}
                      >
                        {show ? (
                          <RiEye2Line
                            size={{
                              base: "8px",
                              sm: "12px",
                              md: "16px",
                              lg: "24px",
                            }}
                          />
                        ) : (
                          <RiEyeCloseFill
                            size={{
                              base: "8px",
                              sm: "12px",
                              md: "16px",
                              lg: "40px",
                            }}
                          />
                        )}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {formik.touched.password && formik.errors.password && (
                    <FormErrorMessage>
                      {formik.errors.password}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl
                  isInvalid={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                >
                  <InputGroup mt={"20px"}>
                    <Input
                      placeholder="Confirm Password"
                      id="confirmPassword"
                      name="confirmPassword"
                      borderColor={"black"}
                      variant={"flushed"}
                      type={show ? "text" : "confirmPassword"}
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                    ></Input>
                    <InputRightElement>
                      <Button
                        size={"md"}
                        onClick={handleClick}
                        variant={"unstyled"}
                      >
                        {show ? (
                          <RiEye2Line
                            size={{
                              base: "8px",
                              sm: "12px",
                              md: "16px",
                              lg: "24px",
                            }}
                          />
                        ) : (
                          <RiEyeCloseFill
                            size={{
                              base: "8px",
                              sm: "12px",
                              md: "16px",
                              lg: "40px",
                            }}
                          />
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
                  <Button
                    mt={"20px"}
                    w={"150px"}
                    borderRadius={"50px"}
                    onClick={onClose}
                    colorScheme="red"
                  >
                    Close
                  </Button>
                  <Button
                    ml={"20px"}
                    mt={"20px"}
                    w={"150px"}
                    borderRadius={"50px"}
                    type="submit"
                    colorScheme="yellow"
                  >
                    Change
                  </Button>
                </ModalFooter>
              </form>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
