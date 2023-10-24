import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Flex,
  FormControl,
  Input,
  FormLabel,
  FormHelperText,
  InputGroup,
  InputLeftAddon,
  Button,
  InputRightElement,
  useToast,
  Stack,
  Text,
} from "@chakra-ui/react";
import { MdAlternateEmail, MdLockOutline, MdPhone, MdPeopleOutline, MdOutlineEscalatorWarning } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { registerUser } from "../../redux/reducer/AuthReducer";
import { Link, useNavigate } from "react-router-dom";

const Navbarregister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showconfirmPassword, setShowconfirmPassword] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        "Password must contain at least 8 characters, one uppercase, one number and one special case character"
      ),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    phone: Yup.string()
      .matches(/^[0-9]/, "Invalid phone number")
      .required("Phone number is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmpassword: "",
      refcode: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmitLoading(true);
        await dispatch(registerUser(values, toast));
        setSubmitLoading(false);
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <Box
      my={{ base: "5vh" }}
      p={{ base: "4%", md: "2%" }}
      width={{ base: "90%", md: "30vw" }}
      mx="auto"
      border="1px solid grey"
      borderRadius="10px">
      <form onSubmit={formik.handleSubmit}>
        <FormControl>
          <Flex justify={"space-between"}>
            <FormLabel>Email address</FormLabel>
            {formik.touched.email && formik.errors.email ? (
              <FormHelperText color="red">{formik.errors.email}</FormHelperText>
            ) : null}
          </Flex>
          <InputGroup mb={4}>
            <InputLeftAddon children={<MdAlternateEmail />} />
            <Input
              type="email"
              {...formik.getFieldProps("email")}
              isInvalid={formik.touched.email && formik.errors.email}
            />
          </InputGroup>

          <Flex justify={"space-between"}>
            <FormLabel>Username</FormLabel>
            {formik.touched.username && formik.errors.username ? (
              <FormHelperText color="red">{formik.errors.username}</FormHelperText>
            ) : null}
          </Flex>
          <InputGroup mb={4}>
            <InputLeftAddon children={<MdPeopleOutline />} />
            <Input
              type="text"
              {...formik.getFieldProps("username")}
              isInvalid={formik.touched.username && formik.errors.username}
            />
          </InputGroup>

          <Flex justify={"space-between"}>
            <FormLabel>Password</FormLabel>
            {formik.touched.password && formik.errors.password ? (
              <FormHelperText color="red">{formik.errors.password}</FormHelperText>
            ) : null}
          </Flex>
          <InputGroup mb={4}>
            <InputLeftAddon children={<MdLockOutline />} />
            <Input
              type={showPassword ? "text" : "password"}
              {...formik.getFieldProps("password")}
              isInvalid={formik.touched.password && formik.errors.password}
            />{" "}
            <InputRightElement width="4.5rem">
              <Button
                onClick={() => setShowPassword(!showPassword)}
                bgColor="#5a9819"
                color={"white"}
                _hover={{ bgColor: "#3d550f" }}>
                Show
              </Button>
            </InputRightElement>
          </InputGroup>

          <Flex justify={"space-between"}>
            <FormLabel>Confirm Password</FormLabel>
            {formik.touched.confirmpassword && formik.errors.confirmpassword ? (
              <FormHelperText color="red">{formik.errors.confirmpassword}</FormHelperText>
            ) : null}
          </Flex>
          <InputGroup mb={4}>
            <InputLeftAddon children={<MdLockOutline />} />
            <Input
              type={showconfirmPassword ? "text" : "password"}
              {...formik.getFieldProps("confirmpassword")}
              isInvalid={formik.touched.confirmpassword && formik.errors.confirmpassword}
            />
            <InputRightElement width="4.5rem">
              <Button
                onClick={() => setShowconfirmPassword(!showconfirmPassword)}
                bgColor="#5a9819"
                color={"white"}
                _hover={{ bgColor: "#3d550f" }}>
                Show
              </Button>
            </InputRightElement>
          </InputGroup>

          <Flex justify={"space-between"}>
            <FormLabel>Phone</FormLabel>
            {formik.touched.phone && formik.errors.phone ? (
              <FormHelperText color="red">{formik.errors.phone}</FormHelperText>
            ) : null}
          </Flex>
          <InputGroup mb={4}>
            <InputLeftAddon children={<MdPhone />} />
            <Input
              type="text"
              {...formik.getFieldProps("phone")}
              isInvalid={formik.touched.phone && formik.errors.phone}
            />
          </InputGroup>
          <Flex justify={"space-between"}>
            <FormLabel>Ref Code</FormLabel>
            <FormHelperText color="red">*Optional</FormHelperText>
          </Flex>
          <InputGroup mb={4}>
            <InputLeftAddon children={<MdOutlineEscalatorWarning />} />
            <Input type="text" {...formik.getFieldProps("refcode")} />
          </InputGroup>
          <Button
            type="submit"
            mt={"2%"}
            width={"100%"}
            isLoading={submitLoading}
            bgColor="#5a9819"
            color={"white"}
            _hover={{ bgColor: "#3d550f" }}>
            Register
          </Button>
        </FormControl>
      </form>
      <Flex alignItems="center" justifyContent="center">
        <Text color={"#5f6c37"}>Already have an account ?</Text>
        <Link to={"/signin"}>
          <Text ml={2} color="green">
            Sign in
          </Text>
        </Link>
      </Flex>
    </Box>
  );
};

export default Navbarregister;
