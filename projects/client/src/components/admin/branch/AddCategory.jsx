import {
  Button,
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
  Text,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import {
  addCategory,
  getCategory,
} from "../../../redux/reducer/CategoryReducer";

const AddCategory = ({ isOpen, onClose }) => {
  const toast = useToast();
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Category Name is required"),
    image: Yup.mixed()
      .required("Category Image is required")
      .test(
        "fileSize",
        "File size is too large",
        (value) => !value || value.size <= 1048576
      )
      .test("fileType", "Invalid file format", (value) => {
        if (!value) {
          return true;
        }
        const supportedFormats = ["jpg", "jpeg", "png", "gif"];
        const fileExtension = value.name.split(".").pop().toLowerCase();
        return supportedFormats.includes(fileExtension);
      }),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      image: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(addCategory(values, toast, onClose, resetForm));
        await dispatch(getCategory());
      } catch (error) {
        console.log(error);
      }
    },
  });

  const isButtonDisabled =
    !formik.isValid || formik.isSubmitting || !formik.dirty;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize={"xl"} fontWeight={700}>
            Add New Category
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <FormControl
              isRequired
              isInvalid={formik.errors.name && formik.touched.name}
            >
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                name="name"
                placeholder="Enter category name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl
              mt={4}
              isRequired
              isInvalid={formik.errors.image && formik.touched.image}
            >
              <FormLabel>Image</FormLabel>
              <Input
                type="file"
                accept=".jpg, .jpeg, .png, .gif"
                name="image"
                onChange={(e) => {
                  formik.setFieldValue("image", e.currentTarget.files[0]);
                }}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.image}</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              display={"flex"}
              justifyContent={"center"}
              w={"100%"}
              mt={"6"}
              rounded={"lg"}
              color={"white"}
              bgColor={"brand.main"}
              type="submit"
              isLoading={formik.isSubmitting}
              loadingText="Adding..."
              _hover={{ bgColor: "brand.hover" }}
              _active={{ bgColor: "brand.active" }}
              isDisabled={isButtonDisabled}
            >
              Add Category
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddCategory;
