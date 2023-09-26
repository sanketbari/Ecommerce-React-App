import axios from "axios";

import {
  ALL_PRODUCT_FAIL,
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_SUCCESS,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_SUCCESS,
  CLEAR_ERRORS,
} from "../constants/productConstants";

//keyword=""
export const getProduct = () => async (dispatch) => { //keyword=""
  try {
    dispatch({ type: ALL_PRODUCT_REQUEST });
    //let link = `/api/v1/products/${keyword}`; //${keyword}?keyword=product
    console.log("IngetProduct = ");
    const { data } = await axios.get("/api/v1/products");//"/api/v1/products"

    dispatch({
      type: ALL_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};


export const getSearchedProduct = (keyword="") => async (dispatch) => { //keyword=""
  try {
    dispatch({ type: ALL_PRODUCT_REQUEST });
    //${keyword}?keyword=product

    const { data } = await axios.get(`/api/v1/products?keyword=${keyword}`);//"/api/v1/products"
    console.log("keyword = ",keyword);
    console.log("searched data::",data);

    dispatch({
      type: ALL_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
    dispatch({type: CLEAR_ERRORS})
}


export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/product/${id}`);

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};