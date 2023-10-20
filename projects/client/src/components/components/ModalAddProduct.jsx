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
  Select,
  Stack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../../redux/reducer/CategoryReducer";
import { addProduct } from "../../redux/reducer/ProductReducer";
import Swal from "sweetalert2";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const addProductSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  category_id: Yup.string().required("Category is required"),
  price: Yup.number().required("Price must be number is required"),
  description: Yup.string().required("Description is required"),
  product_img: Yup.mixed()
    .required("Product Image is required")
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
  weigth: Yup.number().required("Weight is Required"),
});
export default function ModalAddProduct({ isOpen, onClose }) {
  const [store, setStore] = useState([]);
  const dispatch = useDispatch();
  const toast = useToast();
  const { category } = useSelector((state) => state.CategoryReducer);
  const fetchData = async () => {
    const respon = await axios.get(`${URL_API}/store/branch`);
    console.log("sroe,", respon.data);
    setStore(respon.data.data);
  };

  useEffect(() => {
    fetchData();
    dispatch(getCategory());
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      category_id: "",
      price: "",
      admin_discount: 0,
      description: "",
      product_img: null,
      weigth: "",
    },
    validationSchema: addProductSchema,
    onSubmit: (values) => {
      const productImg = document.getElementById("product_img").files[0];
      const formData = new FormData();
      formData.append("product_img", productImg);
      dispatch(addProduct(values, productImg, Swal, toast));
      onClose();
      formik.resetForm();
    },
  });

  const isButtonDisabled = !formik.isValid || formik.isSubmitting;
  return (
    <>
      <Box>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Product</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box>
                <form onSubmit={formik.handleSubmit}>
                  <FormControl
                    isRequired
                    isInvalid={formik.touched.name && formik.errors.name}
                  >
                    <FormLabel>Name</FormLabel>
                    <Input
                      id="name"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      placeholder="Product name"
                    ></Input>
                    <Center>
                      {formik.touched.newName && formik.errors.newName && (
                        <FormErrorMessage>
                          {formik.errors.newName}
                        </FormErrorMessage>
                      )}
                    </Center>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={
                      formik.touched.category_id && formik.errors.category_id
                    }
                  >
                    <Select
                      {...formik.getFieldProps("category_id")}
                      id="category_id"
                      name="category_id"
                      mt={5}
                      placeholder="Select Category"
                    >
                      {category.map((category) => {
                        return (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        );
                      })}
                      {formik.touched.category_id &&
                        formik.errors.category_id && (
                          <FormErrorMessage>
                            {formik.errors.category_id}
                          </FormErrorMessage>
                        )}
                    </Select>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={
                      formik.touched.product_img && formik.errors.product_img
                    }
                  >
                    <FormLabel mt={5}>Image</FormLabel>
                    <Input
                      type="file"
                      accept=".jpeg, .jpg, .png, .gif"
                      variant={""}
                      id="product_img"
                      name="product_img"
                      onChange={(e) => {
                        formik.setFieldValue(
                          "product_img",
                          e.currentTarget.files[0]
                        );
                      }}
                      onBlur={formik.handleBlur}
                    />
                    <Center>
                      {formik.touched.product_img &&
                        formik.errors.product_img && (
                          <FormErrorMessage>
                            {formik.errors.product_img}
                          </FormErrorMessage>
                        )}
                    </Center>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={formik.touched.price && formik.errors.price}
                  >
                    <FormLabel mt={5}>Price</FormLabel>
                    <Input
                      id="price"
                      name="price"
                      type="text"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      placeholder="Price"
                    ></Input>
                    <Center>
                      {formik.touched.price && formik.errors.price && (
                        <FormErrorMessage>
                          {formik.errors.price}
                        </FormErrorMessage>
                      )}
                    </Center>
                  </FormControl>
                  <FormControl
                    isInvalid={
                      formik.touched.admin_discount &&
                      formik.errors.admin_discount
                    }
                  >
                    <FormLabel mt={5}>Admin Discount</FormLabel>
                    <Input
                      placeholder="Discount (optional)"
                      id="admin_discount"
                      name="admin_discount"
                      aria-label="Admin"
                      type="text"
                      value={formik.values.admin_discount}
                      onChange={formik.handleChange}
                    ></Input>
                    <Center>
                      {formik.touched.admin_discount &&
                        formik.errors.admin_discount && (
                          <FormErrorMessage>
                            {formik.errors.admin_discount}
                          </FormErrorMessage>
                        )}
                    </Center>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={
                      formik.touched.description && formik.errors.description
                    }
                  >
                    <FormLabel mt={5}>Description</FormLabel>
                    <Input
                      type="textarea"
                      placeholder="Description"
                      id="description"
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                    ></Input>
                    <Center>
                      {formik.touched.description &&
                        formik.errors.description && (
                          <FormErrorMessage>
                            {formik.errors.description}
                          </FormErrorMessage>
                        )}
                    </Center>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={formik.touched.weigth && formik.errors.weigth}
                  >
                    <FormLabel mt={5}>Weight</FormLabel>
                    <Input
                      id="weigth"
                      name="weigth"
                      type="text"
                      value={formik.values.weigth}
                      onChange={formik.handleChange}
                      placeholder="Weight"
                    ></Input>
                    <Center>
                      {formik.touched.weigth && formik.errors.weigth && (
                        <FormErrorMessage>
                          {formik.errors.weigth}
                        </FormErrorMessage>
                      )}
                    </Center>
                  </FormControl>
                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      type="submit"
                      bg={"brand.main"}
                      _hover={{ bg: "brand.hover", color: "white" }}
                      isDisabled={isButtonDisabled}
                      isLoading={formik.isSubmitting}
                      loadingText="Adding Product..."
                    >
                      Add Product
                    </Button>
                  </ModalFooter>
                </form>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}
