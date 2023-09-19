import axios from "axios";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import UserLanding from "./pages/user/UserLanding";
import Shop from "./pages/user/Shop";
import About from "./pages/user/About";
import Store from "./pages/user/Store";
import AdminSignIn from "./pages/admin/AdminSignIn";
import SuperDashboard from "./pages/admin/SuperDashboard";
import BranchDashboard from "./pages/admin/BranchDashboard";
import Signin from "./pages/Signin";
import Register from "./pages/Register";
import UserAuth from "./userAuth";
// import Navbar from "./components/landing/Navbar";
import "./style/main.css";
import Notfound from "./pages/Notfound";
import Verify from "./pages/verify";
import { setUserLocation } from "./redux/reducer/AuthReducer";
import { useDispatch } from "react-redux";
import UserProfile from "./components/landing/UserProfile";
import { useSelector } from "react-redux";
import Cart from "./components/landing/cart";
import Product from "./pages/Product";
import { getProduct, getStoreProduct, getStore_id } from "./redux/reducer/ProductReducer";
import Address from "./pages/user/Address";
import { getAddress, getDefaultAddress, setPrimaryAddress } from "./redux/reducer/AddressReducer";
import Category from "./pages/Category";

function App() {
  const role = useSelector((state) => state.AdminReducer.branchAdmin.role_id);
  const { location, lon, lat } = useSelector((state) => state.AuthReducer);
  const { userAddress, defaultAddress } = useSelector((state) => state.AddressReducer);
  const { user } = useSelector((state) => state.AuthReducer);
  const dispatch = useDispatch();

  console.log(defaultAddress);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { longitude, latitude } = position.coords;
          dispatch(setUserLocation(latitude, longitude));
          dispatch(getStore_id({ lat: latitude, lon: longitude }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation not supported");
    }
  };

  const defaultUserAddress = async () => {
    const defaultAddress = userAddress.find((address) => address.isdefault);

    if (!defaultAddress) {
      return;
    }

    const { latitude, longitude } = defaultAddress;

    // await dispatch(setPrimaryAddress(address_id, toast));
    await dispatch(setUserLocation(latitude, longitude));
    await dispatch(getAddress(user.id));
  };

  useEffect(() => {
    if (user) {
      dispatch(getDefaultAddress());
      dispatch(getAddress(user.id));
    }
    if (userAddress.length > 0) {
      defaultUserAddress();
    }
    if (userAddress.length < 1) fetchLocation();
  }, [user]);

  const defaultRoutes = () => {
    if (role === "" || role === 3) {
      return (
        <>
          <Route path="/" element={<UserLanding />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/store" element={<Store />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminSignIn />} />
          <Route path="/verification/:token" element={<Verify />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/*" element={<Product />} />
          <Route path="/category/*" element={<Category />} />
        </>
      );
    }
    return <Route path="/*" element={<Notfound />} />;
  };

  const adminRoutes = () => {
    if (role === 2) {
      return (
        <>
          <Route path="/admin/branch" element={<BranchDashboard />} />
        </>
      );
    }
    return <Route path="/*" element={<Notfound />} />;
  };

  const superadminRoutes = () => {
    if (role === 1) {
      return (
        <>
          <Route path="/admin/super" element={<SuperDashboard />} />
        </>
      );
    }
    return <Route path="/*" element={<Notfound />} />;
  };

  const userRoutes = () => {
    if (role === 3) {
      return (
        <>
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/store" element={<Store />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="address" element={<Address />} />
        </>
      );
    }
    return <Route path="/*" element={<Notfound />} />;
  };
  return (
    <>
      <UserAuth>
        <Routes>
          {defaultRoutes()}
          {adminRoutes()}
          {superadminRoutes()}
          {userRoutes()}
        </Routes>
      </UserAuth>
    </>
  );
}

export default App;
