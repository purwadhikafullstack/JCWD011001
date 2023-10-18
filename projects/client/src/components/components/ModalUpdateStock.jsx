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
import Swal from "sweetalert2";
import { useEffect } from "react";
import {
  fetchStore,
  getProduct,
  stockUpdate,
} from "../../redux/reducer/AdminReducer";

const editProductSchema = Yup.object().shape({
  productId: Yup.string().required("product is required"),
  quantity: Yup.number().required("quantity is required"),
});

export default function ModalUpdateStock({ isOpen, onClose, id }) {
  const { product, store } = useSelector((state) => state.AdminReducer);

  useEffect(() => {
    dispatch(getProduct());
    dispatch(fetchStore());
  }, []);
  const dispatch = useDispatch();
  const toast = useToast();
  const formik = useFormik({
    initialValues: {
      productId: "",
      quantity: "",
    },
    validationSchema: editProductSchema,
    onSubmit: (values) => {
      dispatch(stockUpdate(values, Swal));
      onClose();
      formik.resetForm();
    },
  });
  return (
    <>
      <Box>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Stock</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box>
                <form onSubmit={formik.handleSubmit}>
                  <FormControl
                    isInvalid={
                      formik.touched.productId && formik.errors.productId
                    }
                  >
                    <Select
                      {...formik.getFieldProps("productId")}
                      mt={5}
                      placeholder="Select Product"
                      id="productId"
                      name="productId"
                    >
                      {product.map((item) => {
                        return item.isactive ? (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ) : null;
                      })}
                    </Select>
                  </FormControl>
                  <FormControl
                    isInvalid={
                      formik.touched.quantity && formik.errors.quantity
                    }
                  >
                    <Input
                      placeholder="Quantity"
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={formik.values.quantity}
                      onChange={formik.handleChange}
                      mt={5}
                    ></Input>
                    <Center>
                      {formik.touched.quantity && formik.errors.quantity && (
                        <FormErrorMessage>
                          {formik.errors.quantity}
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
                      // isDisabled={isButtonDisabled}
                    >
                      Update Stock
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
