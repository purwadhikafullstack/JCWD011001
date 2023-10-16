import { useToast } from "@chakra-ui/react";

const { useEffect } = require("react");
const { useSelector, useDispatch } = require("react-redux");
const { keepLogin } = require("./redux/reducer/AuthReducer");

const UserAuth = ({ children }) => {
  const { user } = useSelector((state) => state.AuthReducer);
  const dispatch = useDispatch();
  const toast = useToast();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(keepLogin(toast));
    }
  }, []);
  return <>{children}</>;
};

export default UserAuth;
