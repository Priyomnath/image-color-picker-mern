import { useState } from "react";
import { SketchPicker } from "react-color";
import api from "./api";


function App() {


const [name,setName] = useState("");

const [email,setEmail] = useState("");

const [password,setPassword] = useState("");

const [color,setColor] = useState("#ff0000");

const [colors,setColors] = useState([]);

const [file,setFile] = useState(null);




// REGISTER

async function register(){

try{

const res = await api.post(
"/auth/register",
{
name,
email,
password
}
);

alert(res.data.message);


}catch(error){

alert(error.response?.data?.message);

}

}




// LOGIN

async function login(){

try{

const res = await api.post(
"/auth/login",
{
email,
password
}
);


alert(res.data.message);


}catch(error){

alert(error.response?.data?.message);

}

}





// IMAGE UPLOAD

async function uploadImage(){


if(!file) return "";


const formData = new FormData();


formData.append(
"image",
file
);



const res = await api.post(
"/upload",
formData
);


return res.data.url;


}





// SAVE COLOR


async function saveColor(){


try{


let image = "";


if(file){

image = await uploadImage();

}



await api.post(
"/colors",
{

hex: color,

image

}

);


alert("Color saved");


}catch(error){

console.log(error);

alert("Save failed");

}


}





// GET COLORS


async function getColors(){


const res = await api.get(
"/colors"
);


setColors(res.data);


}





return(


<div className="container mt-5">


<h1 className="text-center">

Color Picker

</h1>





<div className="card p-4 shadow mt-4">


<h3>

Register

</h3>



<input

className="form-control mb-2"

placeholder="Name"

onChange={
e=>setName(e.target.value)
}

/>



<input

className="form-control mb-2"

placeholder="Email"

onChange={
e=>setEmail(e.target.value)
}

/>




<input

className="form-control mb-3"

type="password"

placeholder="Password"

onChange={
e=>setPassword(e.target.value)
}

/>




<button

className="btn btn-primary me-2"

onClick={register}

>

Register

</button>




<button

className="btn btn-success"

onClick={login}

>

Login

</button>



</div>









<div className="card p-4 mt-4">



<SketchPicker


color={color}


onChange={
c=>setColor(c.hex)
}


/>




<h2>

{color}

</h2>





<input

type="file"

className="form-control"


onChange={
e=>setFile(e.target.files[0])
}

/>




<button

className="btn btn-dark mt-3"

onClick={saveColor}

>

Save Color

</button>





<button

className="btn btn-warning mt-3 ms-2"

onClick={getColors}

>

My Colors

</button>



</div>









<div className="mt-4">


{

colors.map(item=>(


<div

className="card p-3 mb-3"

key={item._id || item.id}

>


<h3>

{item.hex}

</h3>




<div

style={{

height:"60px",

background:item.hex

}}

>

</div>





{

item.image &&

<img

src={item.image}

width="150"

className="mt-2"

/>

}




</div>



))

}


</div>



</div>


)


}


export default App;