import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const initialState = {
  branchAdmin: {
    id: null,
    store_id: null,
    name: "",
    email: "",
    role_id: "",
  },
  login: false,
  admin: [],
  product : [],
  store : [],
  page: 1,
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
    setProduct: (state, action) => {
      state.product = [...action.payload];
    },
    setStore: (state, action) => {
      state.store = [...action.payload];
    },
    setPage: (state, action) => {
      state.page = action.payload;
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
        navigate(`/admin/branch`);
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

export const createBranchAdmin = (dataToSend, toast, onClose, resetForm) => {
  return async () => {
    try {
      await axios.post(`${URL_API}/admin/branch-admin`, dataToSend);
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
      dispatch(setAdmin(activeBranchAdmins));
    } catch (error) {
      console.log(error);
    }
  };
};

export const getProduct = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${URL_API}/admin/product?limit=100`);
      console.log(data);
      dispatch(setProduct(data.data));
    } catch (error) {
      console.log(error);
    }
  };
};
export const fetchStore = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${URL_API}/store/branch`);
      dispatch(setStore(data.data))
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
}

export const destroyProduct = (product, Swal) => {
  return async (dispatch) => {
    console.log("destroy ", product)
    const productId = product.id
    console.log("id destroy reducer", productId)
    try {
      const result = await axios.delete(`${URL_API}/admin/product/${productId}`)
      Swal.fire({
        icon: 'success',
        title: 'Product Deleted...',
        text: 'Back in business',
      })
    } catch (error) {
      console.log(error);
    }
  };
}

export const stockUpdate = (values, Swal) => {
  return async(dispatch) => {
    const token = localStorage.getItem("token")
    console.log("update reducer ", values)
    try {
      await axios.post(`${URL_API}/admin/branch/stock`, {
        productId : values.productId,
        quantity : values.quantity
      }, {
        headers : {
          Authorization : `Bearer ${token}`
        }
      }
      )
      Swal.fire({
        icon: 'success',
        title: 'Stock in your branch updated...',
        text: 'Back in business',
      })
    } catch (error) {
      console.log(error)
    }
  }
}
export const disableProduct = (values, Swal, toast) => {
  return async () => {
    try {
      const id = values.id
      console.log("delete values", id)
      const data = await axios.patch(
        `${URL_API}/admin/delete/${id}`,
        {}
      )
      Swal.fire({
        icon: 'error',
        title: 'Product disabled...',
        text: 'Restore the product is stock already exist',
      })
    } catch (error) {
      console.log(error)
      toast({
        title: "Failed",
        description: error?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }
}
export const enableProduct = (values, Swal, toast) => {
  return async () => {
    try {
      const id = values.id
      console.log("enable values", id)
      const data = await axios.patch(
        `${URL_API}/admin/enable/${id}`,
        {}
      )
      Swal.fire({
        icon: 'success',
        title: 'Product enable...',
        text: 'Back to business',
      })
    } catch (error) {
      console.log(error)
      toast({
        title: "Failed",
        description: error?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }
}
export const branchUserCancel = (item) => {
  return async(dispatch) => {
    console.log("user cancel reducer masuk ", item)
    console.log("id dari branch", item.id)
    const transaction_id = item.id
    console.log("inimi", transaction_id)
    try { 
      const response = await axios.patch(`${URL_API}/admin/branch/cancel/${transaction_id}`)
    } catch (error) {
      console.log(error)
    }
  }
}
export const branchUserConfirm = (item) => {
  return async(dispatch) => {
    console.log("user confirm reducer masuk ", item)
    console.log("id dari branch", item.id)
    const transaction_id = item.id
    console.log("inimi", transaction_id)
    try { 
      const response = await axios.patch(`${URL_API}/admin/branch/confirm/${transaction_id}`)
    } catch (error) {
      console.log(error)
    }
  }
}
export const branchSendOrder = (item) => {
  return async(dispatch) => {
    console.log("user send reducer masuk ", item)
    console.log("id dari branch", item.id)
    const transaction_id = item.id
    console.log("inimi", transaction_id)
    try { 
      const response = await axios.patch(`${URL_API}/admin/branch/send/${transaction_id}`)
    } catch (error) {
      console.log(error)
    }
  }
}




export const { setBranchAdmin,setStore, setAdmin, loginSuccess, logoutSuccess, setRoleId, setPage, setProduct } = AdminReducer.actions;

export default AdminReducer.reducer;
