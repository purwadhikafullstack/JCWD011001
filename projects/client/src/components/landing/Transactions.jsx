import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../../redux/reducer/CartReducer";
import { useNavigate } from "react-router-dom";

export default function Transactions() {
  const { carts, item } = useSelector((state) => state.CartReducer);
  const { totalHarga } = useSelector((state) => state.ProductReducer);
  const navigate = useNavigate();
  let price = 0;

  const checkout = () => {
    navigate("/checkout");
  }
    carts.map((cart) => {
      return price += cart.total_price;
    });
  console.log("harga", price);
  const cartLength = item.reduce((total, item) => total + item.quantity, 0);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCart());
  }, []);
  return (
    <>
      <Box ml={"24px"} mt={"32px"} position={"sticky"} top={"20px"}>
        <Box>
          <Card>
            <CardBody>
              <Text fontWeight={"bold"}>Shopping Summary</Text>
              <Divider />
              <Text>Total products: {cartLength}</Text>
              <Divider mt={"20px"} bgColor={"black"} />
              <Text fontWeight={"bold"}>Total price : Rp. {price}</Text>
              <CardFooter mt={"24px"}>
                <Button onClick={() => checkout()} w={"200px"} color={"white"} bg={"brand.main"} _hover={{ bg: "brand.hover" }} _active={{ bg: "brand.active" }} isDisabled={cartLength <= 0}>
                  Checkout
                </Button>
              </CardFooter>
            </CardBody>
          </Card>
        </Box>
      </Box>
    </>
  );
}
