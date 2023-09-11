import React, { useEffect, useState } from "react";
import {
  Button,
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
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { createBranchAdmin } from "../../../redux/reducer/AdminReducer";
import stateData from "../../../data/stateData.json";
import { getBranchAdmin } from "../../../redux/reducer/AdminReducer";

const AddBranchAdmin = ({ isOpen, onClose }) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [showConfirm, setShowConfirm] = useState(false);
  const handleClickConfirm = () => setShowConfirm(!showConfirm);
  const [submitLoading, setSubmitLoading] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();

  const cityOptions = () => {
    const sortedStateData = stateData.sort((a, b) => {
      if (a.province < b.province) return -1;
      if (a.province > b.province) return 1;
      return 0;
    });

    return sortedStateData.map((state) => (
      <option key={state.province_id} value={state.province}>
        {state.province}
      </option>
    ));
  };


  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    branch: Yup.string().required("Branch is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        "Password must be at least 8 characters, 1 symbol, and 1 uppercase"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      branch: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setSubmitLoading(true);
        await dispatch(createBranchAdmin(values, toast, onClose, resetForm));
        setSubmitLoading(false);
        await dispatch(getBranchAdmin());
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize={"xl"} fontWeight={700}>
            Create Branch Admin
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <FormControl
              isRequired
              isInvalid={formik.touched.name && formik.errors.name}
            >
              <FormLabel>Name</FormLabel>
              <Input
                id="name"
                name="name"
                type="text"
                rounded={"lg"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name && (
                <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              isRequired
              isInvalid={formik.touched.email && formik.errors.email}
            >
              <FormLabel mt={4}>Email Address</FormLabel>
              <Input
                id="email"
                name="email"
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
              isRequired
              isInvalid={formik.touched.branch && formik.errors.branch}
            >
              <FormLabel mt={4}>Branch</FormLabel>
              <Select
                id="branch"
                name="branch"
                rounded={"lg"}
                placeholder="Select Branch"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.branch}
              >
                {cityOptions()}
              </Select>
              {formik.touched.branch && formik.errors.branch && (
                <FormErrorMessage>{formik.errors.branch}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              isRequired
              isInvalid={formik.touched.password && formik.errors.password}
            >
              <FormLabel mt={4}>Password</FormLabel>
              <InputGroup>
                <Input
                  id="password"
                  name="password"
                  type={show ? "text" : "password"}
                  _placeholder={{
                    fontSize: "xs",
                    color: "gray.500",
                  }}
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
            <FormControl
              isRequired
              isInvalid={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
            >
              <FormLabel mt={4}>Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  rounded={"lg"}
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
                  <FormErrorMessage>
                    {formik.errors.confirmPassword}
                  </FormErrorMessage>
                )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              display={"flex"}
              justifyContent={"center"}
              w={"100%"}
              mt={"6"}
              rounded={"lg"}
              color={"white"}
              bgColor={"brand.main"}
              isLoading={submitLoading}
              _hover={{ bgColor: "brand.hover" }}
              _active={{ bgColor: "brand.active" }}
            >
              Create Admin
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddBranchAdmin;
