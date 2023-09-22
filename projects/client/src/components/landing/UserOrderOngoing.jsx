import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransaction } from "../../redux/reducer/TransactionReducer";
import UserOrderOngoingCard from "./UserOrderOngoingCard";
import UserOrderOngoingCardDetails from "./UserOrderOngoingCardDetails";
const UserOrderOngoing = ({ setDetail, detail }) => {
  const { transaction } = useSelector((state) => state.TransactionReducer);
  const dispatch = useDispatch();
  const [transactionDetail, setTransactionDetail] = useState({});
  const [transactionProducts, setTransactionProducts] = useState([]);

  useEffect(() => {
    dispatch(getTransaction({}));
  }, []);

  if (!detail) {
    return (
      <>
        {transaction.length > 0 && (
          <Box>
            {transaction.map((item) => (
              <UserOrderOngoingCard
                key={item.id}
                item={item}
                setDetail={setDetail}
                setTransactionDetail={setTransactionDetail}
                setTransactionProducts={setTransactionProducts}
              />
            ))}
          </Box>
        )}
      </>
    );
  }
  return (
    <Box>
      <UserOrderOngoingCardDetails transactionDetail={transactionDetail} transactionProducts={transactionProducts} />
    </Box>
  );
};

export default UserOrderOngoing;
