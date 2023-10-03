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
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { useEffect } from "react";
import { updateProduct } from "../../redux/reducer/ProductReducer";
import { getCategory } from "../../redux/reducer/CategoryReducer";
import Swal from "sweetalert2";

const editProductSchema = Yup.object().shape({
  newName: Yup.string().required("Name is required"),
  categoryId: Yup.string().required("Category is required"),
  price: Yup.number().required("Price must be number is required"),
  description: Yup.string().required("Description is required"),
  // product_img: Yup.mixed()
  //   .required("Category Image is required")
  //   .test(
  //     "fileSize",
  //     "File size is too large",
  //     (value) => !value || value.size <= 1048576
  //   )
  //   .test(
  //     "fileType",
  //     "Invalid file format",
  //     (value) => !value || /\/(jpg|png|gif)$/i.test(value.type)
  //   ),
});
export default function ModalEditProduct({ isOpen, onClose, id }) {
  const { category } = useSelector((state) => state.CategoryReducer);
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);
  const formik = useFormik({
    initialValues: {
      id: id,
      newName: "",
      categoryId: "",
      price: "",
      admin_discount: "",
      description: "",
      product_img: null,
    },
    validationSchema: editProductSchema,
    onSubmit: (values) => {
      const productImg = document.getElementById("product_img").files[0];
      const formData = new FormData();
      formData.append("product_img", productImg);
      console.log(values, productImg);
      dispatch(updateProduct(values, productImg, toast, Swal));
      onClose();
      formik.resetForm();
    },
  });
  const isButtonDisabled = !formik.isValid || formik.isSubmitting;
  return (
    <>
      <Box fontFamily={"montserrat"}>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Product</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box>
                <form onSubmit={formik.handleSubmit}>
                  <FormControl
                    isInvalid={formik.touched.newName && formik.errors.newName}
                  >
                    <Input
                      placeholder="Name Product"
                      id="newName"
                      name="newName"
                      type="text"
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
                  <FormControl
                    isInvalid={
                      formik.touched.categoryId && formik.errors.categoryId
                    }
                  >
                    <Select
                      {...formik.getFieldProps("categoryId")}
                      mt={5}
                      placeholder="Select category"
                      id="categoryId"
                      name="categoryId"
                    >
                      {category.map((item) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <FormControl
                    isInvalid={formik.touched.price && formik.errors.price}
                  >
                    <Input
                      placeholder="Price"
                      id="price"
                      name="price"
                      type="number"
                      value={formik.values.price}
                      onChange={formik.handleChange}
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
                      type="number"
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
                      value={formik.values.product_img}
                    ></Input>
                    <Center>
                      {formik.touched.product_img &&
                        formik.errors.product_img && (
                          <FormErrorMessage>
                            {formik.errors.product_img}
                          </FormErrorMessage>
                        )}
                    </Center>
                  </FormControl>
                  <Input
                    type="hidden"
                    id="id"
                    name="id"
                    value={formik.values.id}
                    onChange={formik.handleChange}
                  />
                  <ModalFooter>
                    <Button
                      bg={"brand.maain"}
                      isLoading={formik.isSubmitting}
                      loadingText="Changing Product..."
                      color={"black"}
                      _hover={{ bg: "brand.hover" }}
                      type="submit"
                      isDisabled={isButtonDisabled}
                    >
                      Edit Product
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
