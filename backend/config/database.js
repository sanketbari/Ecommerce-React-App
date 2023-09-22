const mongoose = require("mongoose");

//Below code before implementing unhandled promise rejection error handling
// const connectDatabase = () =>{
//     mongoose.connect(process.env.DB_URI,
//         {useNewUrlParser: true, useUnifiedTopology: true}).then((data)=>{
//             console.log(`Mongodb connected with server: ${data.connection.host}`);
//         }).catch((err)=>{
//             console.log(err)
//         });
// }

//Below code After implementing unhandled promise rejection error handling 
//- no need to handle error using catch block now 
const connectDatabase = () =>{
    mongoose.connect(process.env.DB_URI,
        {useNewUrlParser: true, useUnifiedTopology: true}).then((data)=>{
            console.log(`Mongodb connected with server: ${data.connection.host}`);
        })
}

module.exports = connectDatabase;