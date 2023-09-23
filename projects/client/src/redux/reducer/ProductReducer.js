import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const initialState = {
  product: [],
  store_id: null,
  store: null,
  page: 1,
  productDetail: null,
  storeStock: [],
};

export const ProductReducer = createSlice({
  name: "ProductReducer",
  initialState,
  reducers: {
    setProduct: (state, action) => {
      state.product = [...action.payload];
    },
    setStore_id: (state, action) => {
      if (!action.payload) {
        state.store_id = null;
        state.store = null;
      } else {
        state.store_id = action.payload.id;
        state.store = action.payload.name;
      }
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setProductDetail: (state, action) => {
      state.productDetail = action.payload;
    },
    setStoreStock: (state, action) => {
      state.storeStock = [...action.payload];
    },
  },
});

export const getProduct = ({ index = 1, order = "ASC", orderBy = "name", category = "" }) => {
  return async (dispatch) => {
    try {
      let query = `?page=${index}`;
      if (order) query += `&order=${order}`;
      if (orderBy) query += `&orderBy=${orderBy}`;
      if (category) query += `&category=${category}`;
      const { data } = await axios.get(`${URL_API}/product/${query}`);
      dispatch(setPage(data.totalPage));
      dispatch(setProduct(data.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const getStoreProduct = ({ lat, lon, index = 1, order = "ASC", orderBy = "name", category = "" }) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${URL_API}/store/nearest/?lat=${lat}&lon=${lon}`);
      console.log("store_id", data.data);
      if (!data.data.id) {
        dispatch(setStore_id(null));
        dispatch(getProduct({ index }));
      } else {
        dispatch(setStore_id(data.data));
        dispatch(getStoreProductNext({ store_id: data.data.id, index, order, orderBy, category }));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const getStoreProductNext = ({ store_id, index, order, orderBy, category = "" }) => {
  return async (dispatch) => {
    try {
      let query = `&page=${index}`;
      if (order) query += `&order=${order}`;
      if (orderBy) query += `&orderBy=${orderBy}`;
      if (category) query += `&category=${category}`;
      const products = await axios.get(`${URL_API}/product/store/?store_id=${store_id}${query}`);
      dispatch(setPage(products.data.totalPage));
      dispatch(setProduct(products.data.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const getStore_id = ({ lat, lon }) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`${URL_API}/store/nearest/?lat=${lat} &lon=${lon}`);
      if (data) return dispatch(setStore_id(data.data));
      else dispatch(setStore_id(null));
    } catch (error) {
      console.log(error);
    }
  };
};

export const getStoreStock = ({ id }) => {
  return async (dispatch) => {
    try {
      console.log(id);
      const { data } = await axios.get(`${URL_API}/product/stock/${id}`);
      dispatch(setStoreStock(data.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const getProductSearch = ({ category, name, store_id }) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(
        `${URL_API}/product/search/?name=${name}&category=${category}&store_id=${store_id}`
      );
      dispatch(setProduct(data.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const addProduct = (values, productImg, Swal, toast) => {
  return async(dispatch) => {
    console.log("prodcut", values)
    console.log("prodcut image", productImg)
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category_id", values.category_id);
      formData.append("store_id", values.store_id)
      formData.append("price", values.price);
      formData.append("admin_discount", values.admin_discount);
      formData.append("description", values.description);
      formData.append("product_img", productImg);
      const data = await axios.post(
        `${URL_API}/product`, formData,
        {
          headers : {
            "Content-Type": "multipart/form-data"
          }
        }
      )
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Product successfully added',
        showConfirmButton: false,
        timer: 1500
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

export const updateProduct = (values, productImg, toast, Swal) => {
  return async() => {
    const id = values.id
    try {
      const formData = new FormData();
      formData.append("newName", values.newName);
      formData.append("category_id", values.categoryId);
      formData.append("price", values.price);
      formData.append("admin_discount", values.admin_discount);
      formData.append("description", values.description);
      formData.append("product_img", productImg);
      const data = await axios.patch(
        `${URL_API}/product/${id}`, formData,
        {
          headers : {
            "Content-Type": "multipart/form-data"
          }
        }
      )
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Product successfully updated',
        showConfirmButton: false,
        timer: 1500
      })
      // setTimeout(() => {
      //   window.location.reload();
      // }, 2000);
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
export const deleteProduct = (values, Swal, toast) => {
  return async () => {
    try {
      const id = values.id
      console.log("delete values", id)
      const data = await axios.patch(
        `${URL_API}/product/delete/${id}`,
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
export const restoreProduct = (values, Swal) => {
  return async () => {
    try {
      const id = values.id
      console.log("id restore", id)
      const data = await axios.patch(
        `${URL_API}/product/restore/${id}`, {}
      )
      Swal.fire({
        icon: 'success',
        title: 'Product restore...',
        text: 'Back in business',
      })
    } catch (error) {
      console.log(error)
    }
  }
}

export const { setProduct, setStore_id, setPage, setProductDetail, setStoreStock } = ProductReducer.actions;
export default ProductReducer.reducer;
