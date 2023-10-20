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
import { setUser } from "../../redux/reducer/AuthReducer";
import Swal from "sweetalert2";
import ChangeButton from "./ChangeButton";
import CloseButton from "./CloseButton";

const ChangeUsernameSchema = Yup.object().shape({
  newName: Yup.string()
    .matches(
      /^.*(?=.{6,})(?=.*[a-z])(?=.*[A-Z]).*$/,
      "Name must contain at least 6 characters, one uppercase"
    )
    .required("Username is required"),
});

const URL_API = process.env.REACT_APP_API_BASE_URL;
export default function ModalChangeName({ isOpen, onClose, user }) {
  const navigate = useNavigate();
  function toHome() {
    navigate("/");
  }
  const dispatch = useDispatch();
  const toast = useToast();

  const change = async (values, newValues) => {
    const token = localStorage.getItem("token");
    const { currentName, newName } = values;
    try {
      const respon = await axios.patch(
        `${URL_API}/profile/name`,
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
      dispatch(setUser(respon.data?.data));
      onClose();
      await Swal.fire("Success!", "Username successfully change", "success");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error.response?.data.message,
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    }
  };
  const formik = useFormik({
    initialValues: {
      newName: user.username || "",
    },
    validationSchema: ChangeUsernameSchema,
    onSubmit: (values) => {
      console.log("ini masuk");
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
