import {
  Button,
  Flex,
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
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import {
  addVoucher,
  getAdminVoucher,
} from "../../../redux/reducer/VoucherReducer";
import axios from "axios";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const AddVoucher = ({ isOpen, onClose }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const [product, setProduct] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${URL_API}/admin/product`);
      setProduct(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const productData = () => {
    const sortedStateData = product.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    return sortedStateData.map((product) => (
      <option key={product.id} value={product.id}>
        {product.name}
      </option>
    ));
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    type: Yup.string().required("Voucher Type is required"),
    expired: Yup.string().required("Expired Date is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      product_id: "",
      nominal: 0,
      percent: 0,
      minimum_payment: 0,
      type: "",
      expired: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(addVoucher(values, toast, onClose, resetForm));
        await dispatch(getAdminVoucher());
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    const selectedDateWithTime = `${selectedDate}T23:59`;
    formik.setFieldValue("expired", selectedDateWithTime);
  };

  const isButtonDisabled =
    !formik.isValid || formik.isSubmitting || !formik.dirty;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "md", md: "xl" }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize={"xl"} fontWeight={700}>
            Add New Voucher
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
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={
                formik.errors.description && formik.touched.description
              }
            >
              <FormLabel mt={4}>Description</FormLabel>
              <Input
                type="text"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={formik.errors.product_id && formik.touched.product_id}
            >
              <FormLabel mt={4}>Product</FormLabel>
              <Select
                name="product_id"
                placeholder="All Product"
                value={formik.values.product_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {productData()}
                <FormErrorMessage>{formik.errors.product_id}</FormErrorMessage>
              </Select>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={formik.errors.type && formik.touched.type}
            >
              <FormLabel mt={4}>Type</FormLabel>
              <Select
                name="type"
                placeholder="Select Discount Type"
                value={formik.values.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="discount">Discount</option>
                <option value="freedelivery">Free Delivery</option>
                <option value="buy1get1">Buy One get One</option>
              </Select>
              <FormErrorMessage>{formik.errors.type}</FormErrorMessage>
            </FormControl>
            <Flex gap={4}>
              <FormControl
                isInvalid={formik.errors.nominal && formik.touched.nominal}
                isDisabled={formik.values.type === "buy1get1"}
              >
                <FormLabel mt={4}>Nominal</FormLabel>
                <Input
                  type="text"
                  name="nominal"
                  inputMode="numeric"
                  value={formik.values.nominal}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormErrorMessage>{formik.errors.nominal}</FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={formik.errors.percent && formik.touched.percent}
                isDisabled={formik.values.type === "buy1get1"}
              >
                <FormLabel mt={4}>Percentage</FormLabel>
                <Input
                  type="text"
                  name="percent"
                  inputMode="numeric"
                  value={formik.values.percent}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormErrorMessage>{formik.errors.percent}</FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={
                  formik.errors.minimum_payment &&
                  formik.touched.minimum_payment
                }
                isDisabled={formik.values.type === "buy1get1"}
              >
                <FormLabel mt={4}>Min. Payment</FormLabel>
                <Input
                  type="text"
                  name="minimum_payment"
                  inputMode="numeric"
                  value={formik.values.minimum_payment}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormErrorMessage>
                  {formik.errors.minimum_payment}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <FormControl
              isRequired
              isInvalid={formik.errors.expired && formik.touched.expired}
            >
              <FormLabel mt={4}>Expired Date</FormLabel>
              <Input
                type="date"
                name="expired"
                value={formik.values.expired.split("T")[0]}
                onChange={handleDateChange}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.expired}</FormErrorMessage>
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
              Add Voucher
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddVoucher;
