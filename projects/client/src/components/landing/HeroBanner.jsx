import React from "react";
import { Box, Image } from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Banner_1 from "../../assets/banners/banner_1.png";
import Banner_2 from "../../assets/banners/banner_2.png";
import Banner_3 from "../../assets/banners/banner_3.png";
import Banner_4 from "../../assets/banners/banner_4.png";
import Banner_5 from "../../assets/banners/banner_5.png";

const HeroBanner = () => {
  return (
    <Box w={"100%"} py={{ base: "28px", md: "40px", lg: "60px"}} px={{ base: "28px", md: "56px", lg: "100px" }}>
      <Carousel
        showArrows={true}
        showThumbs={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={5000}
        stopOnHover={false}
        showStatus={false}
      >
        <Box>
          <Image src={Banner_1} alt="Banner 1" />
        </Box>
        <Box>
          <Image src={Banner_2} alt="Banner 2" />
        </Box>
        <Box>
          <Image src={Banner_3} alt="Banner 3" />
        </Box>
        <Box>
          <Image src={Banner_4} alt="Banner 4" />
        </Box>
        <Box>
          <Image src={Banner_5} alt="Banner 5" />
        </Box>
      </Carousel>
    </Box>
  );
};

export default HeroBanner;
