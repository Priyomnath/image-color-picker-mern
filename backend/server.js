const express=require("express");

const cors = require("cors");

const cookieParser=require("cookie-parser");

require("dotenv").config();

const mongoose = require("mongoose");

const app=express();

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log("MongoDB error", err.message);
    })


app.use(cors({

origin:"http://localhost:5173",

credentials:true

}));


app.use(express.json());

app.use(cookieParser());



app.use(
"/auth",
require("./routes/authRoutes")
);

app.use(
"/upload",
require("./routes/uploadRoutes")
);


app.use(
"/colors",
require("./routes/colorRoutes")
);


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running ${PORT}`);
});