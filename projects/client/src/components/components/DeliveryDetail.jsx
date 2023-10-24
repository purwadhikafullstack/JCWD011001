import { Box, Text, Divider, Flex, Skeleton, Stack, Table, Tr, Tbody, Td } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
const key = process.env.REACT_APP_RO_KEY;
const URL_API = process.env.REACT_APP_API_BASE_URL;

function findMaxNumber(input) {
  var numberPattern = /\d+/g;
  var numbers = input.match(numberPattern);
  if (numbers) {
    if (numbers.length > 1) {
      return Math.max(...numbers.map(Number));
    } else if (numbers.length === 1) {
      return parseInt(numbers[0]);
    }
  }
  return null;
}

const DeliveryDetail = ({ storeCityId, city_id, deliveryDetail, products, setDeliveryprice, setDelivDuration }) => {
  const weightsArray = products.map((product) => product.Product.weight * product.quantity);
  const totalWeight = weightsArray.reduce((acc, currentWeight) => acc + currentWeight, 0);
  const [rajaongkir, setRajaongkir] = useState();
  const [pick, setPick] = useState({});
  const numberPattern = /\d+/g;

  const fetchRajaOngkir = async () => {
    try {
      const { data } = await axios.post(
        `${URL_API}/cart/ongkir`,
        { storeCityId, city_id, totalWeight, deliveryDetail },
        { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setRajaongkir(data.data.rajaongkir);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePickDeliv = (option) => {
    setPick(option);
    setDeliveryprice(option.cost[0].value);
    setDelivDuration(findMaxNumber(option.cost[0].etd));
  };

  useEffect(() => {
    setDeliveryprice(0);
    setPick({});
    setRajaongkir();
    fetchRajaOngkir();
  }, [deliveryDetail]);

  if (!rajaongkir) {
    return (
      <Skeleton>
        <Box borderWidth="1px" borderRadius="lg" p={4} boxShadow="md" mt={4}></Box>
      </Skeleton>
    );
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} boxShadow="md" mt={4}>
      <Flex justify={"space-between"}>
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Delivery Details
        </Text>
        <Text fontSize="lg" fontWeight="bold" mb={2} textTransform={"uppercase"}>
          {deliveryDetail}
        </Text>
      </Flex>
      <Flex justify="space-between" mb={2}>
        <Text>Berat:</Text>
        <Text>{totalWeight} Gram</Text>
      </Flex>
      <Divider mb={2} />
      <Flex justify="space-between" mb={2}>
        <Text>Delivery to:</Text>
        <Text>{rajaongkir.destination_details.city_name}</Text>
      </Flex>
      <Divider mb={2} />
      <Stack spacing={2}>
        <Text>Delivery Options:</Text>
        <Table variant="simple">
          <Tbody>
            {rajaongkir.results[0].costs.map((option) => (
              <Tr
                key={option.service}
                _hover={{ backgroundColor: "#f0f0f0", cursor: "pointer" }}
                onClick={() => handlePickDeliv(option)}
                style={{
                  backgroundColor: pick.service === option.service ? "#E6E6E6" : "inherit",
                }}>
                <Td>{option.description}</Td>
                <Td>{option.cost[0].value}</Td>
                <Td>{option.cost[0].etd.replace("HARI", "")} Day</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Box>
  );
};

export default DeliveryDetail;
