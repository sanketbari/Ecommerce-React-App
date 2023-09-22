const express = require("express");
const cookieParser = require("cookie-parser");

const errorMiddleware = require("./middleware/error.js");

const app = express();

app.use(express.json());
app.use(cookieParser());

//Route imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute.js");
const order = require("./routes/orderRoutes.js");



//Middleware for Error
// app.use("/api/v1",product);
app.use(errorMiddleware);
app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);





app.get("/",(req,res)=>{
    res.status(200).json("Alas! you are here")
})

module.exports = app;