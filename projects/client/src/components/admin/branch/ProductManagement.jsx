import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Center,
  Divider,
  Flex,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  deleteProduct,
  restoreProduct,
  updateProduct,
} from "../../../redux/reducer/ProductReducer";
import ButtonAddProduct from "../../components/ButtonAddProduct";
import { IoTrashOutline } from "react-icons/io5";
import ButtonEditProduct from "../../components/ButtonEditProduct";
import { RxCross1 } from "react-icons/rx";
import { FaCheck, FaTrashCan } from "react-icons/fa6";
import Swal from "sweetalert2";
import { destroyProduct } from "../../../redux/reducer/AdminReducer";
import { BiSearchAlt } from "react-icons/bi";

const ProductManagement = () => {
  const PUBLIC_URL = "http://localhost:8000";
  const [modalClosedTrigger, setModalClosedTrigger] = useState(false);
  const [product, setProduct] = useState([]);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("ASC");
  const [totalPage, setTotalPage] = useState("");
  const [orderByPrice, setOrderByPrice] = useState(false);
  const [orderBy, setOrderBy] = useState("name");
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [sortLabelText, setSortLabelText] = useState("Sort by price");

  const [isLargerThanMD] = useMediaQuery("(min-width: 48em)");
  const handleNext = () => {
    setPage(page + 1);
  };
  const handleOrder = () => {
    setOrder(order === "ASC" ? "DESC" : "ASC");
  };

  const handlePrev = () => {
    if (page === 1) return;
    setPage(page - 1);
  };
  const dispatch = useDispatch();
  const fetchData = async () => {
    const orderByParam = orderByPrice ? "price" : orderBy; // Use 'price' if orderByPrice is true, otherwise use orderBy
    const respon = await axios.get(
      `http://localhost:8000/api/admin/product?name=${name}&limit=5&page=${page}&order=${order}&orderBy=${orderByParam}&category=${category}`
    );
    console.log("isi", respon.data);
    console.log("total", respon.data.totalPage);
    setProduct(respon.data.data);
    setTotalPage(respon.data.totalPage);
  };

  useEffect(() => {
    fetchData();
    if (modalClosedTrigger) {
      fetchData();
      setModalClosedTrigger(false);
    }
    // fetchData();
  }, [page, order, orderBy, orderByPrice, category, modalClosedTrigger, name]);

  const handleSearch = () => {
    const name = document.getElementById("search").value;
    setName(name);
    // if (name) dispatch(getProductSearch({ name, store_id }));
  };
  const handleOrderBy = () => {
    setOrderBy("name");
    setOrderByPrice(false);
    fetchData();
  };

  const handleOrderByPrice = () => {
    setOrderByPrice(!orderByPrice);
    if (orderByPrice) {
      setSortLabelText("Sort by price"); // Change the label text when sorting by price
    } else {
      setSortLabelText("Sort by name"); // Change the label text when sorting by name
    }
  };
  const restore = async (item) => {
    await dispatch(restoreProduct(item, Swal));
    await fetchData();
  };
  const handleDeleteProduct = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      await dispatch(destroyProduct(item, Swal));
      Swal.fire("Deleted!", "The product has been removed.", "success");
    }
    await fetchData();
  };
  const deactive = async (item) => {
    await dispatch(deleteProduct(item, Swal));
    await fetchData();
  };

  const getImage = (image) => {
    return `${PUBLIC_URL}/${image}`;
  };
  return (
    <Box>
      <Stack>
        <Box fontFamily={"montserrat"}>
          <Text
            ml={{ base: "24px", lg: "48px" }}
            mt={{ base: "8px", lg: "24px" }}
            fontSize={{ sm: "24px", md: "32px", lg: "48px" }}
          >
            Product Management
          </Text>
          <ButtonAddProduct setModalClosedTrigger={setModalClosedTrigger} />
          <Flex justify={"space-around"} ml={{ base: "12px", lg: "48px" }}>
            <Select
              placeholder="Sort By"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <option value={"ASC"}>A-Z / (Low Price) - (High Price)</option>
              <option value={"DESC"}>Z-A / (High Price) - (Low Price)</option>
            </Select>
            <Select
              ml={{ base: "12px", lg: "48px" }}
              placeholder="All Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value={"1"}>Vegetables</option>
              <option value={"2"}>Fruit</option>
              <option value={"3"}>Beverage</option>
            </Select>
            <InputGroup ml={{ base: "12px", lg: "48px" }}>
              <InputLeftElement>
                <BiSearchAlt color="#37630A" />
              </InputLeftElement>
              <Input
                id="search"
                w={{ base: "200px", lg: "300px" }}
                onChange={handleSearch}
                placeholder={"Search Product"}
              />
            </InputGroup>
          </Flex>
          <Button
            mt={5}
            ml={{ base: "12px", lg: "48px" }}
            variant={"ghost"}
            _hover={{ bg: "brand.hover", color: "white" }}
            onClick={() => handleOrderByPrice()}
          >
            {sortLabelText}
          </Button>

          <Divider mt={"10px"} />
          {product.map((item) => {
            const active = item.isactive;
            const newPrice = item.price - item.admin_discount;
            return (
              <Box key={item.id}>
                <Card
                  key={item.id}
                  ml={{ base: "32px", lg: "48px" }}
                  // w={isLargerThanMD ? "800px" : "400px"}
                  w={{ base: "680px", lg: "800px" }}
                  mt={"20px"}
                  boxShadow={"lg"}
                  border={"2px"}
                  borderColor={item.isactive ? "gray.100" : "red"} // Add conditional styling
                >
                  <CardBody>
                    <Flex>
                      <Image
                        src={getImage(item.product_img)}
                        alt="sayur"
                        w={"200px"}
                        h={"200px"}
                        borderRadius="lg"
                      />
                      <Stack mt="6" spacing="3">
                        <Heading
                          color={item.isactive ? "green" : "red"}
                          textDecoration={item.isactive ? "" : "line-through"}
                        >
                          {item.Category?.name}
                        </Heading>
                        <Text>{item.name}</Text>
                        <Flex gap={2} fontSize={"12px"}>
                          <Text
                            textDecoration={item.isactive ? "" : "line-through"}
                            fontWeight={"bold"}
                          >
                            Rp. {item.price}
                          </Text>
                          <Text
                            textAlign={"center"}
                            fontWeight={"bold"}
                            textDecoration={"line-through"}
                            color={"#9b9b9b"}
                          >
                            {item.admin_discount > 0
                              ? `Rp. ${item.admin_discount}`
                              : ""}
                          </Text>
                        </Flex>

                        <Text
                          textDecoration={item.isactive ? "" : "line-through"}
                          fontSize="2xl"
                        >
                          Rp.{newPrice}
                        </Text>
                        <Text>{item.description}</Text>
                      </Stack>
                      <Box right={10} top={50} position={"absolute"}>
                        <Stack>
                          <ButtonEditProduct
                            setModalClosedTrigger={setModalClosedTrigger}
                            id={item.id}
                          />
                          {item.isactive ? (
                            <IconButton
                              color={"red"}
                              mt={"12px"}
                              variant={""}
                              icon={
                                <RxCross1
                                  size={"md"}
                                  onClick={() => deactive(item)}
                                />
                              }
                            />
                          ) : (
                            <Box>
                              <Stack>
                                <IconButton
                                  color={"green"}
                                  variant={""}
                                  mt={"12px"}
                                  icon={
                                    <FaCheck
                                      size={"md"}
                                      onClick={() => restore(item)}
                                    />
                                  }
                                />
                                <IconButton
                                  mt={"24px"}
                                  color={"red"}
                                  variant={""}
                                  icon={
                                    <FaTrashCan
                                      size={"md"}
                                      onClick={() => handleDeleteProduct(item)}
                                    />
                                  }
                                />
                              </Stack>
                            </Box>
                          )}
                        </Stack>
                      </Box>
                    </Flex>
                  </CardBody>
                </Card>
              </Box>
            );
          })}
          <Box ml={{ base: "8em", lg: "10em" }} mt={"20px"}>
            <Button
              variant={"ghost"}
              _hover={{ bg: "brand.hover", color: "white" }}
              onClick={() => handlePrev()}
              isDisabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant={"ghost"}
              _hover={{ bg: "brand.hover", color: "white" }}
              ml={"20em"}
              onClick={() => handleNext()}
              isDisabled={page === totalPage}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default ProductManagement;
