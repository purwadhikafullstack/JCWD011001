import {
  Box,
  Button,
  Center,
  FormControl,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
  FormHelperText,
  Divider,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  getAdminVoucher,
  getDeliveryVoucher,
  getUserVoucher,
  setDeliveryVoucherToUse,
  setVoucherToUse,
} from "../../redux/reducer/VoucherReducer";
import { useDispatch, useSelector } from "react-redux";
import { getItem } from "../../redux/reducer/CartReducer";

const TransactionVoucher = ({
  product_price,
  delivery_price,
  setVoucherDiscount,
  setDeliveryDiscount,
  setModalClosedTrigger,
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const userVoucher = useSelector((state) => state.VoucherReducer.userVoucher);
  const deliveryVoucher = useSelector(
    (state) => state.VoucherReducer.deliveryVoucher
  );
  const item = useSelector((state) => state.CartReducer.item);
  const [selectedVoucherData, setSelectedVoucherData] = useState(null);
  const [selectedDeliveryVoucher, setSelectedDeliveryVoucher] = useState([]);

  useEffect(() => {
    dispatch(getAdminVoucher());
    dispatch(getUserVoucher());
    dispatch(getDeliveryVoucher());
    dispatch(getItem());
  }, [dispatch]);

  const userVoucherData = () => {
    return userVoucher.map((voucher) => (
      <option key={voucher.voucherdetail_id} value={voucher.Voucherdetail.id}>
        {voucher.Voucherdetail.name}
      </option>
    ));
  };

  const deliveryVoucherData = () => {
    return deliveryVoucher.map((voucher) => (
      <option key={voucher.voucherdetail_id} value={voucher.Voucherdetail.id}>
        {voucher.Voucherdetail.name}
      </option>
    ));
  };

  const handleVoucherChange = (event) => {
    const selectedId = event.target.value;
    const selectedVoucher = userVoucher.find(
      (voucher) => voucher.Voucherdetail.id === Number(selectedId)
    );

    if (selectedVoucher) {
      setSelectedVoucherData(selectedVoucher);
    } else {
      setSelectedVoucherData(null);
    }
  };

  const handleDeliveryVoucherChange = (event) => {
    const selectedId = event.target.value;
    const selectedVoucher = deliveryVoucher.find(
      (voucher) => voucher.Voucherdetail.id === Number(selectedId)
    );

    if (selectedVoucher) {
      setSelectedDeliveryVoucher(selectedVoucher);
    } else {
      setSelectedDeliveryVoucher(null);
    }
  };

  const handleUseVoucherClick = () => {
    if (selectedVoucherData) {
      if (selectedVoucherData.Voucherdetail.product_id) {
        if (selectedDeliveryVoucher) {
          dispatch(setDeliveryVoucherToUse(selectedDeliveryVoucher));
        }
        setDeliveryDiscount(
          !selectedDeliveryVoucher
            ? 0
            : selectedDeliveryVoucher.Voucherdetail?.percent
            ? (selectedDeliveryVoucher.Voucherdetail.percent * delivery_price) /
              100
            : 0
        );

        dispatch(setVoucherToUse(selectedVoucherData));

        const isProductExist = item.find(
          (product) =>
            product.product_id === selectedVoucherData.Voucherdetail.product_id
        );

        if (selectedVoucherData?.Voucherdetail?.type === "discount") {
          setVoucherDiscount(
            selectedVoucherData.Voucherdetail.nominal
              ? selectedVoucherData.Voucherdetail.nominal
              : selectedVoucherData.Voucherdetail.percent
              ? (selectedVoucherData.Voucherdetail.percent *
                  isProductExist.price) /
                100
              : 0
          );
          setModalClosedTrigger(true);
          onClose();
          return;
        }

        if (selectedVoucherData?.Voucherdetail?.type === "buy1get1") {
          if (isProductExist.quantity < 2) {
            toast({
              title: "Failed",
              description: `Add more ${isProductExist.name} to your cart`,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            return;
          }
          setVoucherDiscount(isProductExist.price);
          setModalClosedTrigger(true);
          onClose();
          return;
        }

        if (!isProductExist) {
          toast({
            title: "Failed",
            description: "There is no match product in your cart",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
      }

      if (selectedVoucherData?.Voucherdetail?.minimum_payment > product_price) {
        toast({
          title: "Failed",
          description:
            "Minimum payment is Rp." +
            selectedVoucherData.Voucherdetail.minimum_payment,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      dispatch(setVoucherToUse(selectedVoucherData));
    }

    if (selectedDeliveryVoucher) {
      dispatch(setDeliveryVoucherToUse(selectedDeliveryVoucher));
    }

    setVoucherDiscount(
      !selectedVoucherData
        ? 0
        : selectedVoucherData.Voucherdetail.nominal
        ? selectedVoucherData.Voucherdetail.nominal
        : selectedVoucherData.Voucherdetail.percent
        ? (selectedVoucherData.Voucherdetail.percent * product_price) / 100
        : 0
    );

    setDeliveryDiscount(
      !selectedDeliveryVoucher
        ? 0
        : selectedDeliveryVoucher.Voucherdetail?.percent
        ? (selectedDeliveryVoucher.Voucherdetail.percent * delivery_price) / 100
        : 0
    );

    setModalClosedTrigger(true);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Center>
            <Text fontSize={"xl"} fontWeight={700}>
              Voucher You Might Use
            </Text>
          </Center>
        </ModalHeader>
        <ModalBody>
          <Tabs colorScheme="green" isFitted variant="enclosed-colored">
            <TabList mb="1em">
              <Tab>Shopping</Tab>
              <Tab>Delivery</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <FormControl>
                  <Select
                    name="voucher_id"
                    placeholder="Select User Voucher"
                    onChange={handleVoucherChange}
                  >
                    {userVoucherData()}
                  </Select>
                </FormControl>
                <Divider my={4} />
                <Box color={"gray.500"}>
                  {selectedVoucherData ? (
                    <Text>{selectedVoucherData.Voucherdetail.description}</Text>
                  ) : (
                    <Text>Select a voucher to see the description.</Text>
                  )}
                </Box>
              </TabPanel>
              <TabPanel>
                <FormControl>
                  {deliveryVoucherData().length > 0 && (
                    <Select
                      name="voucher_id"
                      placeholder="Select Delivery Voucher"
                      onChange={handleDeliveryVoucherChange}
                    >
                      {deliveryVoucherData()}
                    </Select>
                  )}
                  <FormHelperText
                    fontSize={"sm"}
                    color={"gray.500"}
                    fontStyle={"italic"}
                  >
                    *Get free delivery voucher after five successful
                    transactions
                  </FormHelperText>
                </FormControl>
                <Divider my={4} />
                <Box color={"gray.500"}>
                  {selectedDeliveryVoucher ? (
                    <Text>
                      {selectedDeliveryVoucher.Voucherdetail?.description}
                    </Text>
                  ) : (
                    <Text>Select a voucher to see the description.</Text>
                  )}
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            display={"flex"}
            justifyContent={"center"}
            w={"100%"}
            mt={"6"}
            rounded={"lg"}
            color={"white"}
            bgColor={"brand.main"}
            _hover={{ bgColor: "brand.hover" }}
            _active={{ bgColor: "brand.active" }}
            onClick={handleUseVoucherClick}
          >
            Use Voucher
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TransactionVoucher;
