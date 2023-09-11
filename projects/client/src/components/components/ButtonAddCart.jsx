import { Button } from "@chakra-ui/react";
import { HiOutlineShoppingCart } from "react-icons/hi";
export default function AddtoCart() {
  return (
    <>
      <Button
        variant={"outline"}
        colorScheme="teal"
        leftIcon={<HiOutlineShoppingCart />}
      >
        Add Cart
      </Button>
    </>
  );
}
