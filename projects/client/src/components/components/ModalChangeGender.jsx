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

const GenderSchema = Yup.object().shape({
  gender: Yup.string().required("Gender is required"),
});

const URL_API = process.env.REACT_APP_API_BASE_URL;
export default function ModalChangeGender({ isOpen, onClose }) {
  const toast = useToast();
  const choosenGender = async (values) => {
    const token = localStorage.getItem("token");
    try {
      const { currentGender } = values;
      const respon = await axios.patch(
        `${URL_API}/auth/gender`,
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
      console.log("gender", respon);
      onClose();
      await Swal.fire("Success!", "Gender has chosen", "success");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
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
