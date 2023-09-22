import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFinshedTransaction } from "../../redux/reducer/TransactionReducer";
import UserOrderFinishedCard from "./UserOrderFinishedCard";
import UserOrderOngoingCardDetails from "./UserOrderOngoingCardDetails";
import UserOrderFinishedCardDetails from "./UserOrderFinishedCardDetails";

const UserOrderFinished = ({ setDetail, detail }) => {
  const { transaction } = useSelector((state) => state.TransactionReducer);
  const dispatch = useDispatch();
  const [transactionDetail, setTransactionDetail] = useState({});
  const [transactionProducts, setTransactionProducts] = useState([]);

  useEffect(() => {
    dispatch(getFinshedTransaction({}));
  }, []);

  if (!detail) {
    return (
      <>
        {transaction.length > 0 && (
          <Box>
            {transaction.map((item) => (
              <UserOrderFinishedCard
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
      <UserOrderFinishedCardDetails transactionDetail={transactionDetail} transactionProducts={transactionProducts} />
    </Box>
  );
};

export default UserOrderFinished;
