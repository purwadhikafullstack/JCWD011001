import {
  Box,
  ButtonGroup,
  Card,
  CardBody,
  Flex,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import getImage from "../../utils/getImage";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  addQuantity,
  addToCart,
  deleteFromCart,
  deleteItem,
  deleteItemCart,
  deleteItemFromCart,
  getCart,
  getItem,
} from "../../redux/reducer/CartReducer";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import axios from "axios";
import { IoTrashOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
const URL_API = process.env.REACT_APP_API_BASE_URL;

export default function OnGoingCart({ products }) {
  const dispatch = useDispatch();
  const [sold, setSold] = useState(false);
  const { item } = useSelector((state) => state.CartReducer);
  const { store_id } = useSelector((state) => state.ProductReducer);
  const outCart = async (products) => {
    await dispatch(deleteFromCart(products));
    await dispatch(deleteItem(products));
    await dispatch(getItem(store_id));
    await dispatch(getCart());
    // await getItemDetails(products.Product?.id);
  };
  const inCart = async (products) => {
    console.log("in", products);
    await dispatch(addToCart(products));
    await dispatch(addQuantity(products));
    console.log("store depan ", products.store_id);
    await dispatch(getItem(store_id));
    await dispatch(getCart());
    // await getItemDetails(products.Product?.id);
  };
  const destroy = async (products) => {
    console.log("delete", products);
    await dispatch(deleteItemCart(products));
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this item from your cart?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonColor: "#d33",
      icon: "warning",
      dangerMode: true,
    });
    if (result.isConfirmed) {
      await dispatch(deleteItemFromCart(products));
      await dispatch(deleteItemCart(products));
      Swal.fire(
        "Deleted!",
        "The item has been removed from the cart.",
        "success"
      );
    }
    await dispatch(getItem(store_id));
    await dispatch(getCart());
  };
  const cekQuantity = async (products) => {
    console.log("masukk ", products);
    console.log("masukk ", products.product_id);
    try {
      const response = await axios.get(
        `${URL_API}/product/item/detail/${products.product_id}/${store_id}}`
      );
      console.log("apa respon ?", response);
      const itemQuantity = response.data.ProductBranch?.quantity;
      console.log("QUAN", itemQuantity);
      if (products.quantity >= itemQuantity) {
        setSold(true);
        return;
      } else {
        setSold(false);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    cekQuantity(products);
  }, [products]);
  return (
    <Box px={"20px"}>
      <Card
        mt={"8"}
        w={{
          base: "100%",
        }}
        ml={{ lg: "100px" }}
        boxShadow={"lg"}
        key={products.id}
      >
        <CardBody>
          <Box fontWeight={"bold"} mb={"24px"}>
            <Text>{products.Store?.name}</Text>
          </Box>
          <Flex>
            <Image src={getImage(products.Product?.product_img)} w={"30%"} />
            <Box ml={"32px"}>
              <Text>{products.name}</Text>
              <Text fontWeight={"bold"}>Rp. {products.price}</Text>
            </Box>
          </Flex>
          <Flex justify={"space-between"}>
            <Box>
              <IconButton
                color={"blackAlpha.600"}
                variant={""}
                icon={<IoTrashOutline size={{ base: "", lg: "md" }} />}
                onClick={() => destroy(products)}
              />
            </Box>
            <Box ml={{ md: "200px", lg: "400px" }}>
              <ButtonGroup variant={"none"}>
                <IconButton
                  color={"red"}
                  icon={<AiOutlineMinusCircle />}
                  isDisabled={products.quantity === 1}
                  onClick={() => outCart(products)}
                ></IconButton>
                <Text fontSize={"2xl"}>{products.quantity}</Text>
                <IconButton
                  color={"green"}
                  icon={<AiOutlinePlusCircle />}
                  onClick={() => inCart(products)}
                  isDisabled={
                    sold
                    // cekQuantity(products)
                    // products.quantity ===
                    // branchProduct.quantity
                  }
                ></IconButton>
              </ButtonGroup>
            </Box>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
}
