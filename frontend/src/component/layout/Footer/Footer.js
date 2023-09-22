import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftfooter">
        <h4>Download our App</h4>
        <p>Download app for Android and IOS mobile phone</p>
        {/* <img src={playstore} alt="Playstore"/>
        <img src={appstore} alt="Appstore"/> */}
      </div>

      <div className="midfooter">
        <h1>InningsOne</h1>
        <p>High quality is our first priority</p>
        <p>copyrights 2023 &copy; Sanket Bari</p>
      </div>

      <div className="rightfooter">
        <h4>Follow us on:</h4>
        <a href="http://instagram.com">Instagram</a>
        <a href="http://youtube.com">Youtube</a>
        <a href="http://Linkedin.com">Linkedin</a>
      </div>
    </footer>
  );
};

export default Footer;
