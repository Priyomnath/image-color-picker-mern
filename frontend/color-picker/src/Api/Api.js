import axios from "axios";


const api = axios.create({

baseURL: "https://image-color-picker-mern.onrender.com/api",

withCredentials:true

});


export default api;