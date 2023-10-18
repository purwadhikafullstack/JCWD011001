import React, { useEffect, useRef } from "react";
import { Box, Center, Flex, IconButton, Image, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import getImage from "../../utils/getImage";
import { getCategory } from "../../redux/reducer/CategoryReducer";

const Category = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category } = useSelector((state) => state.CategoryReducer);
  const containerRef = useRef(null);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const handleScroll = (direction) => {
    const container = containerRef.current;
    const scrollAmount = 250;
    const newScrollLeft = container.scrollLeft + direction * scrollAmount;
    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  return (
    <Box
      w={"100%"}
      py={{ base: "28px", md: "40px" }}
      px={{ base: "28px", md: "48px", lg: "100px" }}
      bg={"#F7F7F1"}
    >
      <Box mb={{ base: 2, md: 4 }}>
        <Center>
          <Text fontWeight={"bold"} fontSize={{ base: "2xl", md: "4xl" }}>
            Categories
          </Text>
        </Center>
      </Box>
      <Center>
        <Box
          ref={containerRef}
          w={`${category.length * 250}px`}
          display={"flex"}
          py={{ base: 4, md: 8 }}
          overflowX={"hidden"}
          scrollBehavior={"smooth"}
          gap={{ base: 4, md: 8 }}
        >
          {category &&
            category.map((category) => (
              <Box key={category.id} w={"250px"}>
                <Box
                  onClick={() => {
                    navigate(`/category/${category.id}`);
                  }}
                  w={{ base: "100px", md: "200px" }}
                  h={{ base: "105px", md: "210px" }}
                  bg={"white"}
                  borderWidth={"1px"}
                  p={{ base: "10px", lg: "20px" }}
                  align={"center"}
                  boxShadow={{ base: "md", md: "lg" }}
                  rounded={{ base: "lg", md: "xl" }}
                  _hover={{
                    transform: "scale(1.03)",
                    transition: "300ms",
                    cursor: "pointer",
                  }}
                >
                  <Image
                    src={getImage(category.category_img)}
                    alt={category.name}
                    style={{ width: "70%" }}
                  />
                  <Text
                    mt={{ base: 2, md: 4 }}
                    fontSize={{ base: "sm", md: "xl" }}
                    fontWeight={"medium"}
                  >
                    {category.name}
                  </Text>
                </Box>
              </Box>
            ))}
        </Box>
      </Center>
      <Center>
        <Flex gap={4} mt={4}>
          <IconButton
            variant={"ghost"}
            icon={<IoChevronBackOutline />}
            onClick={() => handleScroll(-1)}
            rounded={"full"}
          />
          <IconButton
            variant={"ghost"}
            icon={<IoChevronForwardOutline />}
            onClick={() => handleScroll(1)}
            rounded={"full"}
          />
        </Flex>
      </Center>
    </Box>
  );
};

export default Category;
