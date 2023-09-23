import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setBranchAdmin, setRoleId } from "./AdminReducer";
import { getStore_id } from "./ProductReducer";
const URL_API = process.env.REACT_APP_API_BASE_URL;
const KEY = process.env.REACT_APP_KEY;

const initialState = {
  user: {
    id: null,
    username: "",
    name: "",
    birthdate: "",
    email: "",
    phone: "",
    gender: "",
    profileimg: "",
    refcode: "",
    refby: "",
    // confirmPassword: ""
  },
  login: false,
  location: null,
  lon: null,
  lat: null,
};

export const AuthReducer = createSlice({
  name: "AuthReducer",
  initialState,
  reducers: {
    setUser: (state, action) => {
      // console.log("isi", action.payload);
      const { id, username, name, birthdate, email, phone, gender, profileimg, refcode, refby } = action.payload;
      state.user = { id, username, name, birthdate, email, phone, gender, profileimg, refcode, refby };
      state.login = true;
    },
    loginSuccess: (state, action) => {
      // state.user = {...action.payload};
      state.login = true;
      // localStorage.setItem("token", action.payload);
    },
    logoutSuccess: (state) => {
      // state.user = initialState.user;
      state.login = false;
      setTimeout(() => {
        document.location.href = "/";
      }, 1000);
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setLonLat: (state, action) => {
      state.lon = action.payload.lng;
      state.lat = action.payload.lat;
    },
  },
});

export const logoutAuth = (toast) => {
  return async (dispatch) => {
    try {
      localStorage.removeItem("token");
      dispatch(logoutSuccess());
      toast({
        title: "Logout Success",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
    }
  };
};
export const registerUser = (value, toast) => {
  return async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/user`, value);
      console.log(data);
      toast({
        title: "Register Success",
        description: `${value.username} berhasil dibuat`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      toast({
        title: "Register Gagal",
        description: error.response.data.message,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };
};

export const loginAuth = (values, setLoading, toast, navigate) => {
  return async (dispatch) => {
    try {
      setLoading(true);
      const respon = await axios.post(`${URL_API}/auth/auth`, {
        email: values.email,
        password: values.password,
      });
      // dispatch(setUser())
      const token = respon.data.token;
      localStorage.setItem("token", token);
      dispatch(setUser(respon.data.Account));
      dispatch(loginSuccess());
      toast({
        title: "Login Success",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        navigate("/");
      }, 550);
    } catch (error) {
      console.log(error);
      toast({
        title: "Login Failed",
        description: error?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      dispatch(setRoleId(3));
    }
  };
};

export const keepLogin = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
      const respon = await axios.get(`${URL_API}/auth/keep`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(respon.data);
      if (respon.data.findAdmin) dispatch(setBranchAdmin(respon.data.findAdmin));
      if (respon.data.findUser) {
        dispatch(setUser(respon.data.findUser));
        dispatch(setRoleId(3));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const setUserLocation = (latitude, longitude) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${KEY}&language=id`
      );
      for (let i = 0; i < data.results.length; i++) {
        if (data.results[i].components.state) {
          await dispatch(setLocation(data.results[i].components));
          await dispatch(setLonLat(data.results[i].geometry));
          break;
        } else throw new Error("Location not found");
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const { loginSuccess, logoutSuccess, setUser, setLocation, setLonLat } = AuthReducer.actions;

export default AuthReducer.reducer;
