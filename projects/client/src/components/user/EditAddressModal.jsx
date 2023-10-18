import {
  Button,
  FormControl,
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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editAddress, getAddress } from "../../redux/reducer/AddressReducer";
const API_KEY = process.env.REACT_APP_RO_KEY;
const URL_API = process.env.REACT_APP_API_BASE_URL;
const KEY = process.env.REACT_APP_KEY;
let fullAddress = "";
let latitude = "";
let longitude = "";

const EditAddressModal = ({ isOpen, onClose, address_id, initialAddress }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [district, setDistrict] = useState("");
  const [selectedProvinceData, setSelectedProvinceData] = useState(null);
  const [streetAddress, setStreetAddress] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const { user } = useSelector((state) => state.AuthReducer);

  const id = user.id;

  useEffect(() => {
    if (initialAddress?.address) {
      const addressParts = initialAddress.address.split(", ");

      setStreetAddress(addressParts[0] || "");
      setDistrict(addressParts[1] || "");
      setSelectedCity("");
      setSelectedProvince("");
    }
  }, [initialAddress]);

  useEffect(() => {
    const getProvinces = async () => {
      try {
        const response = await axios.get(`${URL_API}/region/province`, {});
        setProvinces(response.data.rajaongkir.results);
        getCities(response.data.rajaongkir.results[0].province_id);
      } catch (error) {
        console.error("Error fetching provinces", error);
      }
    };
    getProvinces();
  }, []);

  const getCities = async (provinceId) => {
    try {
      const response = await axios.get(`${URL_API}/region/city/${provinceId}`, {
        headers: {
          key: API_KEY,
        },
      });
      setCities(response.data.rajaongkir.results);
    } catch (error) {
      console.error("Error fetching cities", error);
    }
  };
  const saveAddressData = async () => {
    const provinceName = selectedProvinceData
      ? selectedProvinceData.province
      : "";
    const addressData = `${district}, ${selectedCity}, ${provinceName}`;
    fullAddress = `${streetAddress}, ${district}, ${selectedCity}, ${provinceName}`;

    try {
      const location = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?key=${KEY}&q=${encodeURIComponent(
          addressData
        )}&language=id`
      );

      latitude = location.data.results[0].geometry.lat;
      longitude = location.data.results[0].geometry.lng;
    } catch (error) {
      console.error("Error fetching geolocation data", error);
    }
  };

  const resetFormValues = () => {
    setSelectedProvince("");
    setSelectedCity("");
    setDistrict("");
    setStreetAddress("");
    setSelectedProvinceData(null);
  };

  const onSubmit = async () => {
    if (selectedProvince && selectedCity && district && streetAddress) {
      setSubmitLoading(true);
      await saveAddressData();
      await dispatch(
        editAddress(address_id, id, fullAddress, latitude, longitude, toast, onClose, resetFormValues)
      );
      await dispatch(getAddress(id));
      setSubmitLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Address</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>Province</FormLabel>
            <Select
              placeholder="Select Province"
              rounded={"lg"}
              onChange={(e) => {
                const selectedValue = e.target.value;
                setSelectedProvince(selectedValue);
                setSelectedCity("");
                setCities([]);

                const selectedProvinceData = provinces.find(
                  (province) => province.province_id === selectedValue
                );

                setSelectedProvinceData(selectedProvinceData);
                getCities(selectedValue);
              }}
            >
              {provinces.map((province) => (
                <option key={province.province_id} value={province.province_id}>
                  {province.province}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel mt={4}>City</FormLabel>
            <Select
              placeholder="Select City"
              onChange={(e) => {
                setSelectedCity(e.target.value);
              }}
              value={selectedCity}
              isDisabled={!selectedProvince}
            >
              {cities.map((city) => (
                <option key={city.city_id} value={city.city_name}>
                  {city.city_name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel mt={4}>District/Kecamatan</FormLabel>
            <Input
              id="district"
              name="district"
              type="text"
              placeholder="Enter District/Kecamatan"
              rounded={"lg"}
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
              }}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel mt={4}>Address</FormLabel>
            <Input
              id="address"
              name="address"
              type="text"
              placeholder="Enter Address, street, cluster, etc"
              rounded={"lg"}
              value={streetAddress}
              onChange={(e) => {
                setStreetAddress(e.target.value);
              }}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            type="submit"
            display={"flex"}
            justifyContent={"center"}
            w={"100%"}
            mt={"6"}
            rounded={"lg"}
            color={"white"}
            bgColor={"brand.main"}
            onClick={onSubmit}
            isLoading={submitLoading}
            isDisabled={
              !(selectedProvince && selectedCity && district && streetAddress)
            }
            _hover={{ bgColor: "brand.hover" }}
            _active={{ bgColor: "brand.active" }}
          >
            Save Address
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditAddressModal;