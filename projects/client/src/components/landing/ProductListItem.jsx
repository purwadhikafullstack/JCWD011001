import React, { useEffect, useState } from "react";
import { Badge, Box, Button, Center, Divider, Flex, Heading, Image, Spinner, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import getImage from "../../utils/getImage";

const ProductListItem = ({ product }) => {
  const [isDiscount, setIsDiscount] = useState(false);
  const navigate = useNavigate();
  const [productDetail, setProductDetail] = useState({});
  console.log("PROD", product);

  useEffect(() => {
    if (product?.admin_discount > 0 || product.Product?.admin_discount > 0) {
      setIsDiscount(true);
    }
  }, []);

  if (product.Product?.name) {
    return (
      <Box
        align="center"
        bg="white"
        rounded="3xl"
        w={{ base: "150px", md: "200px" }}
        p={2}
        pb={6}
        boxShadow={{ base: "lg", md: "xl" }}
        _hover={{
          boxShadow: { base: "lg", md: "2xl" },
          cursor: "pointer",
        }}
        onClick={() => {
          navigate(`/product/${product.Product.id}`);
        }}>
        <Image
          src={getImage(product.Product.product_img) || null}
          w="50%"
          alignContent="center"
          fit="cover"
          overflow="hidden"
          fallback={
            <Center>
              <Spinner />
            </Center>
          }
          loading="lazy"
        />
        <Box mt={{ base: 4, md: 8 }} textAlign="left" pl={{ base: 2, md: 4 }}>
          <Flex alignItems="center">
            <Badge borderRadius="full" px="2" colorScheme="green">
              {product.Product.Category.name}
            </Badge>
            {isDiscount && (
              <Image
                src="https://cdn.icon-icons.com/icons2/1138/PNG/512/1486395314-13-discount_80575.png"
                w={"12%"}
                ml={2}
              />
            )}
          </Flex>
          <Box mt={1} fontWeight="semibold" as="h4" lineHeight="tight" noOfLines={2}>
            {product.Product.name}
          </Box>
          {isDiscount && (
            <>
              <Flex gap={2} direction={{ base: "column", md: "row" }}>
                <Text
                  fontWeight={"bold"}
                  textDecoration={"line-through"}
                  color={"#9b9b9b"}
                  fontSize={{ base: "xs", md: "lg" }}>
                  Rp.{product?.Product.price},-
                </Text>
                <Text fontWeight={"bold"} fontSize={{ base: "xs", md: "lg" }}>
                  Rp.{product?.Product.price - product?.Product.admin_discount}
                  ,-
                </Text>
              </Flex>
            </>
          )}
          {!isDiscount && (
            <Text fontWeight={"bold"} mb={3}>
              Rp.{product?.Product.price},-
            </Text>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      align="center"
      bg="white"
      rounded="3xl"
      w={{ base: "150px", md: "200px" }}
      p={2}
      pb={8}
      boxShadow={{ base: "lg", md: "xl" }}
      _hover={{
        boxShadow: { base: "lg", md: "2xl" },
        cursor: "pointer",
      }}
      onClick={() => {
        navigate(`/product/${product.id}`);
      }}>
      <Image
        src={getImage(product.product_img) || null}
        w="50%"
        alignContent="center"
        fit="cover"
        overflow="hidden"
        fallback={
          <Center>
            <Spinner />
          </Center>
        }
        loading="lazy"
      />
      <Box mt={{ base: 4, md: 8 }} textAlign="left" pl={{ base: 2, md: 4 }}>
        <Flex alignItems="center">
          <Badge borderRadius="full" px="2" colorScheme="green">
            {product.Category.name}
          </Badge>
          {isDiscount && (
            <Image
              src="https://cdn.icon-icons.com/icons2/1138/PNG/512/1486395314-13-discount_80575.png"
              w={"12%"}
              ml={2}
            />
          )}
        </Flex>
        <Box mt={1} fontWeight="semibold" as="h4" lineHeight="tight" noOfLines={2}>
          {product.name}
        </Box>
        {isDiscount && (
          <>
            <Flex gap={2} direction={{ base: "column", md: "row" }}>
              <Text
                fontWeight={"bold"}
                textDecoration={"line-through"}
                color={"#9b9b9b"}
                fontSize={{ base: "xs", md: "lg" }}>
                Rp.{product?.price},-
              </Text>
              <Text fontWeight={"bold"} fontSize={{ base: "xs", md: "lg" }}>
                Rp.{product?.price - product?.admin_discount},-
              </Text>
            </Flex>
          </>
        )}
        {!isDiscount && (
          <Text fontWeight={"bold"} mb={3}>
            Rp.{product?.price},-
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default ProductListItem;
