import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { loginAdmin } from "../../redux/reducer/AdminReducer";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo_main.png";

const AdminSignIn = () => {
  const [show, setShow] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      dispatch(loginAdmin(values, setLoading, toast, navigate));
    },
  });

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      h={"100vh"}
      bg={"gray.100"}
    >
      <Box
      bg={"white"}
        boxShadow={"lg"}
        rounded={"2xl"}
        w={{ base: "80vw", md: "60vw", lg: "40vw" }}
      >
        <Box mt={8} display={"flex"} flexDir={"column"} alignItems={"center"} gap={2}>
          <Image
            w={"200px"}
            src={Logo}
            alt="logo"
          />
          <Heading fontSize={"3xl"} color={"brand.main"}>
            Admin Page
          </Heading>
        </Box>
        <VStack spacing={"4"} p={8}>
          <Box w={"full"}>
            <Text
              w={"100%"}
              fontSize={"2xl"}
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
                  Password
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
                bgColor={"brand.main"}
                _hover={{ bgColor: "brand.hover" }}
                _active={{ bgColor: "brand.active" }}
              >
                {isLoading ? <Spinner /> : "Sign In"}
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
