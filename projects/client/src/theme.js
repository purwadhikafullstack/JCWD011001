import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      main: "#37630A",
      hover: "#457811",
      active: "#2D5406",
    },
  },
  // fonts: {
  //   heading: `'Montserrat', sans-serif`,
  //   body: `'Montserrat', sans-serif`,
  // },
});

export default theme;