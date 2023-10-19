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
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import CloseButton from "./CloseButton";
import ChangeButton from "./ChangeButton";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/reducer/AuthReducer";

const birthSchema = Yup.object().shape({
  birthdate: Yup.date().required("Date is required"),
});

const URL_API = process.env.REACT_APP_API_BASE_URL;
export default function ModalChangeBirthdate({ isOpen, onClose }) {
  const toast = useToast();
  const dispatch = useDispatch();
  const chooseBirthdate = async (values) => {
    const token = localStorage.getItem("token");
    try {
      const { currentBirthdate } = values;
      const respon = await axios.patch(
        `${URL_API}/auth/birthdate`,
        {
          currentBirthdate: currentBirthdate,
          newBirthdate: values.birthdate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setUser(respon.data?.find));
      onClose();
      await Swal.fire(
        "Success!",
        "Please logout first if you wanna change again",
        "success"
      );
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
      birthdate: "",
    },
    validationSchema: birthSchema,
    onSubmit: (values) => {
      chooseBirthdate(values);
      //   changePassword(values);
    },
  });
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Birthdate</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <form onSubmit={formik.handleSubmit}>
                <FormControl
                  isInvalid={
                    formik.touched.birthdate && formik.errors.birthdate
                  }
                >
                  <Input
                    id="birthdate"
                    name="birthdate"
                    value={formik.values.birthdate}
                    onChange={formik.handleChange}
                    placeholder="Select Date and Time"
                    w={"400px"}
                    type="date"
                    focusBorderColor="green.400"
                  ></Input>
                  <Center>
                    {formik.touched.birthdate && formik.errors.birthday && (
                      <FormErrorMessage>
                        {formik.errors.birthday}
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
