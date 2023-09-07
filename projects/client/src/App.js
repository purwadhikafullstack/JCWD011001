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
import UserProfile from "./components/landing/UserProfile";
import { useSelector } from "react-redux";

function App() {
  const role = useSelector((state) => state.AdminReducer.branchAdmin.role_id);
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   (async () => {
  //     const { data } = await axios.get(
  //       `${process.env.REACT_APP_API_BASE_URL}/greetings`
  //     );
  //     setMessage(data?.message || "");
  //   })();
  // }, []);

  const defaultRoutes = () => {
    if (role === "") {
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
        </>
      );
    }
    return <Route path="/*" element={<Notfound />} />;
  };

  const adminRoutes = () => {
    if (role === 2) {
      return (
        <>
          <Route path="/admin/super" element={<SuperDashboard />} />
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
          <Route path="/admin/branch" element={<BranchDashboard />} />
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
