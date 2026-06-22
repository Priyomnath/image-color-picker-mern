import {useState} from "react";
import axios from "axios";
  

function App(){


const [image,setImage]=useState(null);

const [color,setColor]=useState("");



function upload(e){


let img=
URL.createObjectURL(
e.target.files[0]
);


setImage(img);


}



function pick(e){


let canvas=
document.createElement("canvas");


let ctx=
canvas.getContext("2d");


let img=new Image();


img.src=image;


img.onload=()=>{


canvas.width=img.width;

canvas.height=img.height;


ctx.drawImage(img,0,0);



let pixel=
ctx.getImageData(
e.nativeEvent.offsetX,
e.nativeEvent.offsetY,
1,1
).data;



let hex=
"#"+
((1<<24)+(pixel[0]<<16)+(pixel[1]<<8)+pixel[2])
.toString(16)
.slice(1);



setColor(hex);



axios.post(
"http://localhost:5000/api/colors",
{
hex,
rgb:`rgb(${pixel[0]},${pixel[1]},${pixel[2]})`
},
{
withCredentials:true
}

);


}



}




return (

<div>

<h1>
Image Color Picker
</h1>


<input
type="file"
onChange={upload}
/>



<br/>


{image &&

<img
src={image}
width="500"
onClick={pick}
/>

}



<h2>{color}</h2>


</div>

)

}


export default App;