import { Box, Flex, Input, InputGroup, InputLeftElement, Select } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, getProductSearch, getStoreProduct } from "../../redux/reducer/ProductReducer";

const SearchProducts = () => {
  const { location, lon, lat } = useSelector((state) => state.AuthReducer);
  const { store_id } = useSelector((state) => state.ProductReducer);
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      const name = document.getElementById("search").value;
      if (name) dispatch(getProductSearch({ name, store_id }));
      if (location && !name) dispatch(getStoreProduct({ location, lon, lat }));
      if (!location && !name) dispatch(getProduct({}));
    }
  };

  const setSearch = (event) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    if (searchValue === "") {
      const name = document.getElementById("search").value;
      if (name) dispatch(getProductSearch({ name, store_id }));
      if (location && !name) dispatch(getStoreProduct({ location, lon, lat }));
      if (!location && !name) dispatch(getProduct({}));
    }
  }, [searchValue]);

  return (
    <Box w={"50%"}>
      <InputGroup bg={"white"}>
        <InputLeftElement>
          <BiSearchAlt color="#37630A" />
        </InputLeftElement>
        <Input
          id="search"
          onKeyDown={handleSearch}
          onChange={setSearch}
          focusBorderColor="#37630A"
          type="search"
          placeholder="Search..."
        />
      </InputGroup>
    </Box>
  );
};

export default SearchProducts;
