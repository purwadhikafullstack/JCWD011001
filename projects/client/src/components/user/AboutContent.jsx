import { Box, Center, Image, Text } from "@chakra-ui/react";
import React from "react";
import Logo from "../../assets/logo_main.png";
import WhyChooseData from "../../data/whyChooseData";
import TeamData from "../../data/teamData";
import { Link } from "react-router-dom";

const AboutContent = () => {
  const appName = (
    <span style={{ color: "#37630A", fontWeight: "bold" }}>GrocerEasy</span>
  );

  return (
    <Box w={"full"} py={"16px"} px={{ base: "28px", md: "48px", lg: "100px" }}>
      <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight={"medium"}>
        About Us
      </Text>
      <Box mt={4} mb={8}>
        <Center mb={4}>
          <Image
            src={Logo}
            w={{ base: "200px", md: "300px" }}
            alt="grocereasy logo"
          />
        </Center>
        <Text>
          Welcome to {appName}, your ultimate destination for hassle-free
          grocery shopping! At {appName}, we understand the importance of your
          time and the convenience of having your everyday essentials delivered
          right to your doorstep. Our innovative grocery app is designed to make
          your life easier, providing you with a seamless online shopping
          experience that caters to all your daily needs.
        </Text>
        <Box mt={8}>
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight={"bold"}
            color={"brand.main"}
            mb={2}
          >
            Our Vision
          </Text>
          <Text>
            At {appName}, our vision is to revolutionize the way you shop for
            groceries. We strive to offer a comprehensive range of products,
            from fresh produce to household necessities, ensuring that you have
            access to high-quality items without the hassle of navigating
            crowded stores or waiting in long queues.
          </Text>
        </Box>
        <Box mt={8}>
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight={"bold"}
            color={"brand.main"}
            mb={2}
          >
            Why Choose Us?
          </Text>
          <Box
            display={"flex"}
            justifyContent={"center"}
            flexWrap={{ base: "nowrap", md: "wrap", lg: "nowrap" }}
            flexDirection={{ base: "column", md: "row" }}
            gap={4}
          >
            {WhyChooseData &&
              WhyChooseData.map((item, index) => (
                <Box
                  key={index}
                  bg={"white"}
                  display={"flex"}
                  flexDirection={"column"}
                  rounded={"xl"}
                  w={{ base: "100%", md: "300px" }}
                  borderWidth={"1px"}
                  gap={2}
                  px={4}
                  py={8}
                  boxShadow={"lg"}
                >
                  <Center>
                    <Image src={item.img} w={"150px"} h={"150px"} />
                  </Center>
                  <Text fontWeight={"bold"} fontSize={"lg"}>
                    {item.title}
                  </Text>
                  <Text>{item.text}</Text>
                </Box>
              ))}
          </Box>
        </Box>
        <Box mt={12}>
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight={"bold"}
            color={"brand.main"}
            mb={2}
          >
            Developed By
          </Text>
          <Text mb={4}>
            {appName} is proudly developed by a passionate team of experts
            dedicated to enhancing your shopping experience. With a deep
            understanding of technology and a commitment to customer
            satisfaction, our developers work tirelessly to ensure the app is
            user-friendly, secure, and always up-to-date with the latest
            features.
          </Text>
          <Box
            display={"flex"}
            flexDirection={{ base: "column", md: "row" }}
            justifyContent={"center"}
            gap={4}
          >
            {TeamData &&
              TeamData.map((item, index) => (
                <Box
                  key={index}
                  bg={"white"}
                  display={"flex"}
                  flexDirection={"column"}
                  rounded={"xl"}
                  w={{ base: "100%", md: "300px" }}
                  borderWidth={"1px"}
                  gap={2}
                  px={4}
                  py={8}
                  boxShadow={"lg"}
                >
                  <Center>
                    <Image src={item.image} w={"200px"} h={"200px"} />
                  </Center>
                  <Text fontWeight={"bold"} fontSize={"lg"}>
                    {item.name}
                  </Text>
                  <Text>{item.role}</Text>
                  <Link to={item.linked} target="_blank">
                    <Text color={"blue.400"}>LinkedIn</Text>
                  </Link>
                </Box>
              ))}
          </Box>
        </Box>
        <Box mt={12}>
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight={"bold"}
            color={"brand.main"}
            mb={2}
          >
            Our Presence
          </Text>
          <Text mb={4}>
            Currently, {appName} operates across three cities in Indonesia:
            Mataram, Makassar, and Yogyakarta. Our established presence in these
            locations allows us to serve a wide customer base, bringing
            convenience and quality to households in these areas.
          </Text>
          <Text>
            Join us in simplifying your grocery shopping experience today and
            discover the joy of stress-free, efficient shopping. Thank you for
            choosing us to be your trusted grocery partner.
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutContent;
