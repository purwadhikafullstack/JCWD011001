import React, { useEffect, useState } from "react";
import { Box, Text, Center, Flex, Spinner } from "@chakra-ui/react";

const UserLocation = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Minta izin pengguna untuk mengakses lokasi
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      });
    } else {
      console.log("Geolocation is not available in this browser.");
    }
  }, []);

  return (
    <Box p={4}>
      <Center>
        {userLocation ? (
          <Flex align={"center"}>
            <Text fontSize="xl">Lokasi Anda:</Text>
            <Text>Latitude: {userLocation.latitude}</Text>
            <Text>Longitude: {userLocation.longitude}</Text>
          </Flex>
        ) : (
          <Spinner size="xs" />
        )}
      </Center>
    </Box>
  );
};

export default UserLocation;
