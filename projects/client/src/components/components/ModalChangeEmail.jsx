import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
import axios from "axios";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Swal from "sweetalert2";
import CloseButton from "./CloseButton";
import ChangeButton from "./ChangeButton";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/reducer/AuthReducer";
import { useState } from "react";

const ChangeEmailSchema = Yup.object().shape({
  newEmail: Yup.string()
    .email("Invalid email address format")
    .required("Email is required"),
});

const URL_API = process.env.REACT_APP_API_BASE_URL;
export default function ModalChangeEmail({ isOpen, onClose, user }) {
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  function toHome() {
    navigate("/");
  }
  const emailChange = async (values) => {
    const token = localStorage.getItem("token");
    const { currentEmail, newEmail } = values;
    try {
      setLoading(true);
      const respon = await axios.patch(
        `${URL_API}/profile/email`,
        {
          currentEmail: currentEmail,
          newEmail: newEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setUser(respon.data?.data));
      onClose();
      await Swal.fire(
        "Success!",
        "Please to verify your new email on inbox/spam",
        "success"
      );
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed",
        description: error?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const formik = useFormik({
    initialValues: {
      // currentEmail: "",
      newEmail: user.email || "",
    },
    validationSchema: ChangeEmailSchema,
    onSubmit: (values) => {
      // console.log("ini masuk");
      console.log("masuk", values);
      emailChange(values);
    },
  });
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Email</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <form onSubmit={formik.handleSubmit}>
                <FormControl
                  isRequired
                  isInvalid={formik.touched.newEmail && formik.errors.newEmail}
                >
                  <FormLabel ml={"25px"} mt={"15px"}>
                    Email Address
                  </FormLabel>
                  <Input
                    required
                    placeholder="New Email"
                    variant={"flushed"}
                    borderColor={"black"}
                    w={"350px"}
                    ml={"25px"}
                    id="newEmail"
                    name="newEmail"
                    type="email"
                    value={formik.values.newEmail}
                    onChange={formik.handleChange}
                  ></Input>
                  {formik.touched.newEmail && formik.errors.newEmail && (
                    <FormErrorMessage>
                      {formik.errors.newEmail}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <ModalFooter>
                  <CloseButton onClose={onClose} />
                  <ChangeButton isLoading={isLoading} />
                </ModalFooter>
              </form>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
