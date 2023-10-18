import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BsPersonCircle } from "react-icons/bs";
import { BiSolidLockAlt } from "react-icons/bi";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Navbar from "../components/landing/Navbar";
import { loginAuth } from "../redux/reducer/AuthReducer";
import { Link, useNavigate } from "react-router-dom";
import ForgotPassword from "../components/user/ForgotPassword";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email address is required")
    .email("Invalid email address format"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Password must contain at least 8 characters, one uppercase, one number and one special case character"
    ),
});

export default function Signin() {
  const [show, setShow] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const toast = useToast();
  const dispath = useDispatch();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const showPassword = () => {
    setShow(!show);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      dispath(loginAuth(values, setLoading, toast, navigate));
    },
  });

  return (
    <>
      <Navbar />
      <Box>
        <Box
          m={{
            base: "50px auto",
            sm: "50px auto",
            md: "80px auto",
            lg: "80px auto",
          }}
          borderRadius={"20px"}
          w={{ sm: "400px", md: "600px", lg: "800px" }}
          h={"400px"}
          textAlign={"center"}
          fontWeight={"medium"}
          color={"black"}
        >
          <Text
            color={"#5b9818"}
            fontSize={"32px"}
            mt={"40px"}
            align={"center"}
          >
            Sign in
          </Text>
          <Text color={"#5f6c37"}>Please login first before shopping</Text>
          <Flex alignItems="center" justifyContent="center">
            <Text color={"#5f6c37"}>Don't have any account ?</Text>
            <Link to={"/register"}>
              <Text ml={2} color="green">
                Create one
              </Text>
            </Link>
          </Flex>
          <form onSubmit={formik.handleSubmit}>
            <Box w={{ sm: "300px", md: "400px", lg: "500px" }} m={"auto"}>
              <FormControl
                isInvalid={formik.touched.email && formik.errors.email}
              >
                <InputGroup mt={"20px"}>
                  <InputLeftElement>
                    <BsPersonCircle />
                  </InputLeftElement>
                  <Input
                    placeholder="Email"
                    isRequired={true}
                    borderColor={"black"}
                    id="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  ></Input>
                </InputGroup>
                {formik.touched.email && formik.errors.email && (
                  <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                isInvalid={formik.touched.password && formik.errors.password}
              >
                <InputGroup mt={"20px"}>
                  <InputLeftElement>
                    <BiSolidLockAlt />
                  </InputLeftElement>
                  <Input
                    placeholder="Password"
                    id="password"
                    name="password"
                    borderColor={"black"}
                    type={show ? "text" : "password"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  ></Input>
                  <InputRightElement>
                    <Button
                      size={"md"}
                      onClick={showPassword}
                      variant={"unstyled"}
                    >
                      {show ? (
                        <AiFillEye
                          size={{
                            base: "8px",
                            sm: "12px",
                            md: "16px",
                            lg: "24px",
                          }}
                        />
                      ) : (
                        <AiFillEyeInvisible
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
                  <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                )}
              </FormControl>
              <Box
                w={"100%"}
                display={"flex"}
                justifyContent={"flex-end"}
                mt={"20px"}
              >
                <Button
                  onClick={onOpen}
                  variant={"link"}
                  color={"#bc6c25"}
                  fontSize={{ sm: "12px", md: "16px", lg: "16px" }}
                  _hover={{ textDecoration: "underline" }}
                >
                  Forgot Password?
                </Button>
              </Box>
              <Button
                type="submit"
                bgColor="#5a9819"
                color={"white"}
                _hover={{ bgColor: "#3d550f" }}
                mt={"30px"}
                w={{ sm: "300px", md: "400px", lg: "500px" }}
              >
                {isLoading ? <Spinner /> : "LOGIN"}
              </Button>
            </Box>
          </form>
        </Box>
        <ForgotPassword isOpen={isOpen} onClose={onClose} />
      </Box>
    </>
  );
}
