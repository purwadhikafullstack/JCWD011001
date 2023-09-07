import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  Input,
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
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const ChangeUsernameSchema = Yup.object().shape({
  currentName: Yup.string().required("Name is required"),
  newName: Yup.string()
    .matches(
      /^.*(?=.{6,})(?=.*[a-z])(?=.*[A-Z]).*$/,
      "Name must contain at least 6 characters, one uppercase"
    )
    .required("Username is required"),
});

const URL_API = process.env.REACT_APP_API_BASE_URL;
export default function ModalChangeName({ isOpen, onClose }) {
  const navigate = useNavigate();
  function toHome() {
    navigate("/");
  }
  const dispatch = useDispatch();
  const toast = useToast();

  const change = async (values, newValues) => {
    const token = localStorage.getItem("token");
    console.log(token);
    const { currentName, newName } = values;
    try {
      const respon = await axios.patch(
        `${URL_API}/auth/name`,
        {
          currentName: currentName,
          newName: newName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("ini respon changeusername", respon);
      toast({
        title: "Username change",
        description: "Please remember your new username to login",
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
        duration: 1000,
        isClosable: true,
      });
    }
  };
  const formik = useFormik({
    initialValues: {
      currentName: "",
      newName: "",
    },
    validationSchema: ChangeUsernameSchema,
    onSubmit: (values) => {
      change(values);
      onClose();
    },
  });
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <form onSubmit={formik.handleSubmit}>
                <FormControl
                  isInvalid={
                    formik.touched.currentName && formik.errors.currentName
                  }
                >
                  <Input
                    required
                    placeholder="Current Username"
                    variant={"flushed"}
                    borderColor={"black"}
                    w={"350px"}
                    ml={"25px"}
                    id="currentName"
                    name="currentName"
                    type="currentName"
                    value={formik.values.currentName}
                    onChange={formik.handleChange}
                  ></Input>
                  <Center>
                    {formik.touched.currentName &&
                      formik.errors.currentName && (
                        <FormErrorMessage>
                          {formik.errors.currentName}
                        </FormErrorMessage>
                      )}
                  </Center>
                </FormControl>
                <FormControl
                  isInvalid={formik.touched.newName && formik.errors.newName}
                >
                  <Input
                    required
                    placeholder="New Username"
                    variant={"flushed"}
                    borderColor={"black"}
                    w={"350px"}
                    mt={"20px"}
                    ml={"25px"}
                    id="newName"
                    name="newName"
                    type="newName"
                    value={formik.values.newName}
                    onChange={formik.handleChange}
                  ></Input>
                  <Center>
                    {formik.touched.newName && formik.errors.newName && (
                      <FormErrorMessage>
                        {formik.errors.newName}
                      </FormErrorMessage>
                    )}
                  </Center>
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
