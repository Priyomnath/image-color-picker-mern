const express=require("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const cors=require("cors");
const cookieParser=require("cookie-parser");


dotenv.config();


const app=express();


app.use(express.json());

app.use(cookieParser());


app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));



mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB Connected")
});



app.use("/api/auth",
require("./routes/authRoutes"));

app.use("/api/colors",
require("./routes/colorRoutes"));



app.listen(5000,()=>{
    console.log("Server running 5000");
});