const { useEffect } = require("react");
const { useSelector, useDispatch } = require("react-redux");
const { keepLogin } = require("./redux/reducer/AuthReducer");

const UserAuth = ({ children }) => {
  const { user } = useSelector((state) => state.AuthReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(keepLogin());
  }, [dispatch]);
  return <>{children}</>;
};

export default UserAuth;
