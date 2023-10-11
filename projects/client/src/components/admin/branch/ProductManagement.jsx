import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Divider,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
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
import { IoPencil, IoTrashOutline } from "react-icons/io5";
import ButtonEditProduct from "../../components/ButtonEditProduct";
import { RxCross1 } from "react-icons/rx";
import { FaCheck, FaTrashCan } from "react-icons/fa6";
import Swal from "sweetalert2";
import { destroyProduct } from "../../../redux/reducer/AdminReducer";
import { BiSearchAlt } from "react-icons/bi";
import ChangeProductPicture from "../../components/ChangeProductPicture";
import ButtonChangeProductPicture from "../../components/ButtonChangeProductPicture";
import ButtonViewProductPicture from "../../components/ButtonViewProductPicture";
import { Pagination } from "../../components/Pagination";

const ProductManagement = () => {
  const [modalClosedTrigger, setModalClosedTrigger] = useState(false);
  const [product, setProduct] = useState([]);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("ASC");
  const [totalPage, setTotalPage] = useState("");
  const [orderByPrice, setOrderByPrice] = useState(false);
  const [orderBy, setOrderBy] = useState("name");
  const [categories, setCategory] = useState("");
  const [name, setName] = useState("");
  const [sortLabelText, setSortLabelText] = useState("Sort by price");
  const { category } = useSelector((state) => state.CategoryReducer);
  const [barang, setBarang] = useState([]);

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
  const generatePageNumbers = (totalPage) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };
  const pageNumbers = generatePageNumbers(totalPage);
  const dispatch = useDispatch();
  const orderByParam = orderByPrice ? "price" : orderBy; // Use 'price' if orderByPrice is true, otherwise use orderBy
  const fetchData = async () => {
    const respon = await axios.get(
      `http://localhost:8000/api/admin/product?name=${name}&limit=3&page=${page}&order=${order}&orderBy=${orderByParam}&category=${categories}`
    );
    setProduct(respon.data.data);
    setTotalPage(respon.data.totalPage);
  };

  useEffect(() => {
    fetchData();
    // ambilData();
    if (modalClosedTrigger) {
      fetchData();
      setModalClosedTrigger(false);
    }
    // fetchData();
  }, [
    page,
    order,
    orderBy,
    orderByPrice,
    categories,
    modalClosedTrigger,
    name,
  ]);

  const handleSearch = () => {
    const name = document.getElementById("search").value;
    setName(name);
  };
  const handleOrderBy = () => {
    setOrderBy("name");
    setOrderByPrice(false);
    fetchData();
  };

  const handleOrderByPrice = () => {
    setOrderByPrice(!orderByPrice);
    if (orderByPrice) {
      setSortLabelText("Sort by price");
    } else {
      setSortLabelText("Sort by name");
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
  console.log("category masuk", category);
  const itemsToMap = product || barang || [];
  console.log("barangss", barang);

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
              value={categories}
              onChange={(e) => setCategory(e.target.value)}
            >
              {category.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
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

          <TableContainer mt={"10px"} fontSize={"11px"} fontWeight={"bold"}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Category</Th>
                  <Th>Name</Th>
                  <Th>Price</Th>
                  <Th>Admin Discount</Th>
                  <Th>Weight</Th>
                  <Th>Product IMG</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {itemsToMap.map(
                  (item) => (
                    <Tr key={item.id}>
                      <Td>{item.Category?.name}</Td>
                      <Td>{item.name}</Td>
                      <Td>{item.price}</Td>
                      <Td>{item.admin_discount}</Td>
                      <Td>{item.weight} Kg</Td>
                      <Td>
                        <Flex>
                          <ButtonChangeProductPicture
                            item={item}
                            setModalClosedTrigger={setModalClosedTrigger}
                          />
                          <ButtonViewProductPicture item={item} />
                        </Flex>
                      </Td>
                      <Td textColor={item.isactive ? "black" : "red"}>
                        {item.isactive ? "Enable" : "Disable"}
                      </Td>
                      <Td>
                        <Flex>
                          <ButtonEditProduct
                            setModalClosedTrigger={setModalClosedTrigger}
                            id={item.id}
                            item={item}
                          />
                          {item.isactive ? (
                            <Button variant={""} onClick={() => deactive(item)}>
                              Disable
                            </Button>
                          ) : (
                            // <IconButton
                            //   color={"red"}
                            //   mt={"12px"}
                            //   variant={""}
                            //   icon={
                            //     <RxCross1
                            //       size={"sm"}
                            //       onClick={() => deactive(item)}
                            //     />
                            //   }
                            // />
                            <Box>
                              <Flex>
                                <IconButton
                                  color={"green"}
                                  variant={""}
                                  // mt={"10px"}
                                  icon={
                                    <FaCheck
                                      // size={"sm"}
                                      onClick={() => restore(item)}
                                    />
                                  }
                                />
                                <IconButton
                                  // mt={"22px"}
                                  color={"red"}
                                  variant={""}
                                  icon={
                                    <FaTrashCan
                                      onClick={() => handleDeleteProduct(item)}
                                    />
                                  }
                                />
                              </Flex>
                            </Box>
                          )}
                        </Flex>
                      </Td>
                    </Tr>
                  )
                  // const active = item.isactive;
                  // const newPrice = item.price - item.admin_discount;
                )}
              </Tbody>
              <Tfoot></Tfoot>
            </Table>
          </TableContainer>
          <Box ml={{ base: "8em", lg: "380px" }} mt={"20px"}>
            <Button
              variant={"ghost"}
              _hover={{ bg: "brand.hover", color: "white" }}
              onClick={() => handlePrev()}
              isDisabled={page === 1}
            >
              Previous
            </Button>
            {pageNumbers.map((pageNumber) => (
              <Button
                key={pageNumber}
                _hover={{ bg: "brand.hover", color: "white" }}
                ml={"0.5em"}
                mr={"0.5em"}
                onClick={() => setPage(pageNumber)}
                isActive={page === pageNumber}
                bgColor={page === pageNumber ? "red" : "brand.main"}
                color={page === pageNumber ? "black" : "black"} // Set text color conditionally
              >
                {pageNumber}
              </Button>
            ))}
            <Button
              variant={"ghost"}
              _hover={{ bg: "brand.hover", color: "white" }}
              // ml={"20em"}
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
