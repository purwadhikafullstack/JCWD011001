import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const initialState = {
  branchAdmin: {
    id: null,
    name: "",
    email: "",
    role_id: "",
  },
  login: false,
  admin: [],
};

export const AdminReducer = createSlice({
  name: "AdminReducer",
  initialState,
  reducers: {
    setBranchAdmin: (state, action) => {
      const { id, name, email, role_id } = action.payload;
      state.branchAdmin = { id, name, email, role_id };
      state.login = true;
    },
    loginSuccess: (state) => {
      state.login = true;
    },
    logoutSuccess: (state) => {
      state.login = false;
      setTimeout(() => {
        document.location.href = "/admin";
      }, 1000);
    },
    setAdmin: (state, action) => {
      state.admin = action.payload;
    },
    setRoleId: (state, action) => {
      state.branchAdmin.role_id = action.payload;
    },
  },
});

export const loginAdmin = (values, setLoading, toast, navigate) => {
  return async (dispatch) => {
    try {
      setLoading(true);
      const respon = await axios.post(`${URL_API}/admin`, {
        email: values.email,
        password: values.password,
      });
      const token = respon.data.token;
      localStorage.setItem("token", token);
      dispatch(setBranchAdmin(respon.data.Account));
      dispatch(loginSuccess());
      if (respon.data.Account.role_id === 1) {
        navigate("/admin/super");
      } else if (respon.data.Account.role_id === 2) {
        navigate("/admin/branch");
      }
      toast({
        title: "Login Success",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
};

export const logoutAdmin = (toast) => {
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

export const createBranchAdmin = (value, toast, onClose, resetForm) => {
  return async () => {
    try {
      await axios.post(`${URL_API}/admin/branch-admin`, value);
      toast({
        title: "Success",
        description: "New branch admin has been created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      resetForm();
    } catch (error) {
      toast({
        title: "Failed",
        description: error.response.data.message,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };
};

export const deleteBranchAdmin = (admin_id, toast) => {
  return async () => {
    try {
      await axios.patch(`${URL_API}/admin/branch-admin/${admin_id}`);
      toast({
        title: "Success",
        description: "Admin has been deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed",
        description: error.response.data.message,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };
};

export const getBranchAdmin = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${URL_API}/admin/branch-admin`);
      const activeBranchAdmins = data.data.filter((item) => item.isactive === true);
      console.log(activeBranchAdmins);
      dispatch(setAdmin(activeBranchAdmins));
    } catch (error) {
      console.log(error);
    }
  };
};

export const { setBranchAdmin, setAdmin, loginSuccess, logoutSuccess, setRoleId } = AdminReducer.actions;

export default AdminReducer.reducer;
