import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import ProductCard from "./ProductCard.js";
import "./Home.css";
import MetaData from "../layout/MetaData.js";
import { getProduct } from "../../actions/productAction.js";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader.js";
import {useAlert} from "react-alert";


// const product = {
//   name: "Blue Jeans",
//   images: [{ path: "../../images/top1.jpg" }],
//   price: "3000rs",
//   _id: "sanket",
// };

function Home() {
  // const alert = useAlert();
  const dispatch = useDispatch();
  
  const { loading, error, products, productsCount } = useSelector(
    (state) => state.products
  );  //using useSelector we are loading data on th page

  // console.log("new obj:", obj);

  useEffect(() => {

    // if(error){
    //     alert.error(error);
        // dispatch(clearErrors());
    // }
    dispatch(getProduct());
  }, [dispatch]); //add error and alert in dependencies if useAlerts is used

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Home Page is working"} />
          <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>Find amazing products below</h1>
            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading"> Featured Products</h2>

          <div className="container" id="container">
            {/* <Product product={product} />*/}

            {products &&
              products.map((product) => <ProductCard product={product} />)}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}

export default Home;
