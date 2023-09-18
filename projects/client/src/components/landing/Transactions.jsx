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

export default function Transactions() {
  const { carts, item } = useSelector((state) => state.CartReducer);
  const { totalHarga } = useSelector((state) => state.ProductReducer);
  let price = 0;
  {
    carts.map((cart) => {
      price += cart.total_price;
    });
  }
  console.log("harga", price);
  const cartLength = item.reduce((total, item) => total + item.quantity, 0);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCart());
  }, []);
  return (
    <>
      <Box ml={"24px"}>
        {item.map((item) => {
          return (
            <Box>
              <Card key={item.key}>
                <CardBody>
                  <Text fontWeight={"bold"}>Shopping Summary</Text>
                  <Divider />
                  <Text>Product price Rp. {item.price}</Text>
                  <Text>Total products: {cartLength}</Text>
                  <Divider mt={"20px"} bgColor={"black"} />
                  <Text fontWeight={"bold"}>Total price : Rp. {price}</Text>
                  <CardFooter mt={"24px"}>
                    <Button w={"200px"} isDisabled={cartLength <= 0}>
                      Checkout
                    </Button>
                  </CardFooter>
                </CardBody>
              </Card>
            </Box>
          );
        })}
      </Box>
    </>
  );
}
