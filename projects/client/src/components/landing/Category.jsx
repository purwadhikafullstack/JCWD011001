import { Box, Center, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import CategoryCard from "./CategoryCard";
import BuahSayur from "../../assets/category/buah_sayur.png";
import BahanPokok from "../../assets/category/bahan_pokok.png";
import DagingIkan from "../../assets/category/daging_ikan.png";
import BahanMasak from "../../assets/category/bahan_masak.png";
import ProdukSusuTelur from "../../assets/category/produk_susu_telur.png";
import Minuman from "../../assets/category/minuman.png";

const Category = () => {
  return (
    <Box
      w={"100%"}
      py={"40px"}
      px={{ base: "60px", lg: "100px" }}
      bg={"#F7F7F1"}
    >
      <Box mb={10}>
        <Center>
          <Heading as={"h2"}>Categories</Heading>
        </Center>
      </Box>
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        flexWrap={"wrap"}
        gap={{ base: 4, md: 8 }}
      >
        <CategoryCard src={BuahSayur} name={"Buah dan Sayur"} />
        <CategoryCard src={BahanPokok} name={"Bahan Pokok"} />
        <CategoryCard src={DagingIkan} name={"Daging dan Ikan"} />
        <CategoryCard src={BahanMasak} name={"Bahan Masakan"} />
        <CategoryCard src={ProdukSusuTelur} name={"Produk Susu dan Telur"} />
        <CategoryCard src={Minuman} name={"Minuman"} />
      </Flex>
    </Box>
  );
};

export default Category;
