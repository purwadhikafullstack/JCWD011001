import {
  Box,
  Button,
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
  Select,
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

const GenderSchema = Yup.object().shape({
  gender: Yup.string().required("Gender is required"),
});

const URL_API = process.env.REACT_APP_API_BASE_URL;
export default function ModalChangeGender({ isOpen, onClose }) {
  const toast = useToast();
  const dispatch = useDispatch();
  const choosenGender = async (values) => {
    const token = localStorage.getItem("token");
    try {
      const { currentGender } = values;
      const respon = await axios.patch(
        `${URL_API}/profile/gender`,
        {
          currentGender: currentGender,
          chooseGender: values.gender,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setUser(respon.data?.data));
      onClose();
      await Swal.fire("Success!", "Gender has chosen", "success");
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
      gender: "",
    },
    validationSchema: GenderSchema,
    onSubmit: (values) => {
      choosenGender(values);
      //   changePassword(values);
    },
  });
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Gender</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <form onSubmit={formik.handleSubmit}>
                <Select
                  {...formik.getFieldProps("gender")}
                  mt={"12px"}
                  ml={"30px"}
                  w={"350px"}
                  placeholder="Select Gender"
                >
                  <option value={"male"}>Male</option>
                  <option>Female</option>
                </Select>
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
