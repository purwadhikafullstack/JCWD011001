import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { loginSuccess } from "../../redux/reducer/AuthReducer";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
// import ForgotPasswordModal from "../components/ForgotPasswordModal";

const AdminSignIn = () => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onForgot = () => {
    onOpen();
  };

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const login = async (values) => {
    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email: values.email,
        password: values.password,
      });
      console.log(res);
      if (res.status === 200) {
        dispatch(loginSuccess(res.data.token));
        if (res.data.role === "Cashier") {
          navigate("/cashier/landing");
        } else if (res.data.role === "Admin") {
          navigate("/admin/landing");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      login(values);
    },
  });

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDir={"column"}
      h={"100vh"}
    >
      <Center>
        <Heading fontSize={"5xl"} mb={4} color={"#37630A"}>
          Admin Page
        </Heading>
      </Center>
      <Box
        boxShadow={"lg"}
        rounded={"2xl"}
        w={{ base: "80vw", md: "60vw", lg: "40vw" }}
      >
        <VStack spacing={"4"} px={8} py={12}>
          <Box w={"full"}>
            <Text
              w={"100%"}
              fontSize={"3xl"}
              display={"flex"}
              justifyContent={"flex-start"}
              fontWeight={"bold"}
            >
              Sign In
            </Text>
          </Box>
          <Box w={"full"}>
            <form onSubmit={formik.handleSubmit}>
              <FormControl
                isInvalid={formik.touched.email && formik.errors.email}
              >
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  rounded={"lg"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email && (
                  <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                isInvalid={formik.touched.password && formik.errors.password}
              >
                <FormLabel htmlFor="password" mt={"4"}>
                  <Flex
                    alignItems={"baseline"}
                    justifyContent={"space-between"}
                  >
                    Password
                    <Button variant={"link"} onClick={onForgot}>
                      <Text
                        fontSize={"xs"}
                        fontWeight={400}
                        color={"blue"}
                        _hover={{ textDecoration: "underline" }}
                      >
                        Forgot Password?
                      </Text>
                    </Button>
                  </Flex>
                </FormLabel>
                <InputGroup>
                  <Input
                    id="password"
                    name="password"
                    type={show ? "text" : "password"}
                    rounded={"lg"}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  <InputRightElement width="3.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? (
                        <IoEyeOffOutline size={"20px"} />
                      ) : (
                        <IoEyeOutline size={"20px"} />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {formik.touched.password && formik.errors.password && (
                  <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                )}
              </FormControl>
              <Button
                type="submit"
                display={"flex"}
                justifyContent={"center"}
                w={"100%"}
                mt={"6"}
                rounded={"lg"}
                color={"white"}
                bgColor={"#37630A"}
                _hover={{ bgColor: "#457811" }}
                _active={{ bgColor: "#2D5406" }}
              >
                Sign In
              </Button>
            </form>
          </Box>
        </VStack>
      </Box>
      {/* <ForgotPasswordModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} /> */}
    </Box>
  );
};

export default AdminSignIn;
