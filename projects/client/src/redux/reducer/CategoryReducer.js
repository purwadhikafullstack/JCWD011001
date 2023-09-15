import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const URL_API = process.env.REACT_APP_API_BASE_URL;

const initialState = {
  category: [],
};

export const CategoryReducer = createSlice({
  name: "CategoryReducer",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = [...action.payload];
    },
  },
});

export const addCategory = (values, toast, onClose, resetForm) => {
  return async () => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category_img", values.image);

      const response = await axios.post(`${URL_API}/category`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast({
          title: "Category Added",
          description: "Category has been added successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        resetForm();
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
};

export const getCategory = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${URL_API}/category`);
      dispatch(setCategory(response.data.categories));
    } catch (error) {
      console.log(error);
    }
  };
};

export const getCategoryById = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${URL_API}/category/${id}`);
      dispatch(setCategory(response.data.category));
    } catch (error) {
      console.log(error);
    }
  };
}

export const deleteCategory = (id, toast) => {
  return async () => {
    try {
      await axios.patch(`${URL_API}/category/deactivate/${id}`);
      toast({
        title: "Success",
        description: "Category has been deleted",
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
      console.log(error);
    }
  };
};

export const editCategory = (id, values, toast, onClose, resetForm) => {
  return async () => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category_img", values.image);

      const response = await axios.patch(
        `${URL_API}/category/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Category Updated",
          description: "Category has been updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        resetForm();
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
};

export const { setCategory } = CategoryReducer.actions;

export default CategoryReducer.reducer;
