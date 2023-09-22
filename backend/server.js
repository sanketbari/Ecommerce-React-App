const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

//Handling uncaugth exception

process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log("shuting down the server due to uncaugth exception");

    process.exit(1);
})

dotenv.config({path:"backend/config/config.env"});

connectDatabase();

const server = app.listen(process.env.PORT,() => {
    console.log(`The server is running on PORT no. http:localhost:${process.env.PORT}`);
})




//unhandled promise rejection

process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log("shuting down the server due to unhandled promise rejection");

    server.close(()=>{
        process.exit(1);
    });

})