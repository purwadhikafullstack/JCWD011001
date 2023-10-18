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
import Checkout from "./pages/user/Checkout";
import UserOrder from "./components/landing/UserOrder";
import UserOrderOngoingCardDetails from "./components/landing/UserOrderOngoingCardDetails";
import ResetPassword from "./pages/user/ResetPassword";
import Contact from "./pages/user/Contact";
import FrequentlyAskedQuestion from "./pages/user/FrequentlyAskedQuestion";
import TermsAndConditions from "./pages/user/TermsAndConditions";
import PrivacyAndPolicy from "./pages/user/PrivacyAndPolicy";

function App() {
  const role = useSelector((state) => state.AdminReducer.branchAdmin.role_id);
  const { user, login } = useSelector((state) => state.AuthReducer);
  const dispatch = useDispatch();

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { longitude, latitude } = position.coords;
          await dispatch(setUserLocation(latitude, longitude));
          await dispatch(getStore_id({ lat: latitude, lon: longitude }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation not supported");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getDefaultAddress());
      return;
    }
    fetchLocation();
  }, [login]);

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
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/*" element={<Product />} />
          <Route path="/category/*" element={<Category />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/frequently-asked-questions" element={<FrequentlyAskedQuestion />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-and-policy" element={<PrivacyAndPolicy />} />
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
          <Route path="/address" element={<Address />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/User-Order" element={<UserOrder />} />
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
