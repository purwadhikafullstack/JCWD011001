import React, { useState } from "react";
import Autosuggest from "react-autosuggest";
import { Input, Box } from "@chakra-ui/react"; // Import komponen dari Chakra UI
import axios from "axios";

const KEY = process.env.REACT_APP_KEY;

const Address = () => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Handle input change
  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  // Triggered when a suggestion is selected
  const onSuggestionSelected = (event, { suggestion }) => {
    setSelectedAddress(suggestion);
  };

  // Fetch suggestions from OpenCage Data API
  const getSuggestions = async (value) => {
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${value}&key=${KEY}&language=id`
      );

      if (response.status === 200) {
        const { results } = response.data;
        const suggestions = results.map((result) => result.formatted);
        setSuggestions(suggestions);
      } else {
        console.error("Failed to fetch suggestions from OpenCage Data API");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Autosuggest input props
  const inputProps = {
    placeholder: "Enter an address...",
    value,
    onChange,
  };

  // Render suggestion item with Chakra UI styles
  const renderSuggestion = (suggestion) => (
    <Box p={2} _hover={{ backgroundColor: "teal.200", cursor: "pointer" }}>
      {suggestion}
    </Box>
  );

  return (
    <Box>
      <h1>Address</h1>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={({ value }) => getSuggestions(value)}
        onSuggestionsClearRequested={() => setSuggestions([])}
        getSuggestionValue={(suggestion) => suggestion}
        renderSuggestion={renderSuggestion} // Menggunakan renderSuggestion yang telah disesuaikan dengan style Chakra UI
        inputProps={inputProps}
        onSuggestionSelected={onSuggestionSelected}
      />

      {selectedAddress && (
        <Box mt={4}>
          <h2>Selected Address:</h2>
          <p>{selectedAddress}</p>
        </Box>
      )}
    </Box>
  );
};

export default Address;
