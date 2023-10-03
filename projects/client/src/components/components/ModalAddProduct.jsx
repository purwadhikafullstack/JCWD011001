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
    .test(
      "fileType",
      "Invalid file format",
      (value) => !value || /\/(jpg|png|gif)$/i.test(value.type)
    ),
});
export default function ModalAddProduct({ isOpen, onClose }) {
  const [store, setStore] = useState([]);
  const dispatch = useDispatch();
  const toast = useToast();
  const { category } = useSelector((state) => state.CategoryReducer);
  const fetchData = async () => {
    const respon = await axios.get("http://localhost:8000/api/store/branch");
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
                    isInvalid={formik.touched.name && formik.errors.name}
                  >
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
                  </Select>
                  <FormControl
                    isInvalid={
                      formik.touched.product_img && formik.errors.product_img
                    }
                  >
                    <Input
                      type="file"
                      mt={5}
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
                    isInvalid={formik.touched.price && formik.errors.price}
                  >
                    <Input
                      id="price"
                      name="price"
                      type="text"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      placeholder="Price"
                      mt={5}
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
                    <Input
                      placeholder="Discount (optional)"
                      id="admin_discount"
                      name="admin_discount"
                      type="text"
                      value={formik.values.admin_discount}
                      onChange={formik.handleChange}
                      mt={5}
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
                    isInvalid={
                      formik.touched.description && formik.errors.description
                    }
                  >
                    <Input
                      type="textarea"
                      mt={5}
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
