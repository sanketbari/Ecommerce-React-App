import React, { Fragment, useEffect } from "react";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getProduct, getProductDetails } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { useParams } from "react-router-dom";
import { getSearchedProduct } from "../../actions/productAction";

const Products = () => {
  const dispatch = useDispatch();

  
  //console.log("keyword = ",keyword);
  const { products, loading, error, productsCount } = useSelector(
    (state) => state.products
  );

  const { keyword } = useParams();
  useEffect(() => {

    console.log("Keyword in Products component::",keyword);
    if(keyword){
      dispatch(getSearchedProduct(keyword));
    }
    else{
      dispatch(getProduct());
    }
  }, [dispatch,keyword]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h2 className="productsHeading">Products</h2>

          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
