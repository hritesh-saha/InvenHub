import { useState } from "react";
import Button from "../components/Button";
import Inputbox from "../components/Inputbox";
import SubHeading from "../components/SubHeading";
import axios from "axios";
import Heading from "../components/Heading";
import { Signout } from "../components/Signout";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export function Predict(){
    const [data,setdata]=useState("");
    const[category,setcategory]=useState("");
    const[date,setdate]=useState("");
    const [error, setError] = useState("");
    const today = new Date();
    const minDate = today.toISOString().split("T")[0];
    const HandleSend=async ()=>{
        try {
            if (!category || !date) {
                setError("All fields are required.");
                return;
            }
            let v={category,date};
            setError("");
            const response=await axios.post("https://inven-hub-backend.vercel.app/predict",v);
            console.log(response.data);
            setdata(response.data);
    
            handleclear()
            
        } catch (error) {
            setError("Something bad happened");    
        }

    }
    const handleclear = async () => {
        setcategory("");
        setdate("");
    }
    return(
        <div className="bg-zinc-100 min-h-screen flex flex-col justify-center">
             <Navbar></Navbar>
    
        <div className="flex flex-col justify-center items-center">
        <div className="rounded-lg bg-zinc-600 border-4 border-gray-200 w-96 text-center p-2 h-max px-4">
            <Heading label="Prediction"></Heading>
            <SubHeading label="Name"></SubHeading>
            <Inputbox label="" name="category" placeholder="category" onChange={(e) =>{const formattedValue = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase();
    setcategory(formattedValue);} }></Inputbox>
            <SubHeading label="Date"></SubHeading>
            <Inputbox type="date" name="date" label="" placeholder="date" min={minDate} onChange={(e) => setdate(e.target.value)}></Inputbox>

            {error && <p className="text-red-500">{error}</p>}
            <Button label="Get Prediction" onClick={HandleSend} ></Button>
        </div>
        <div className="text-center bg-slate-600 p-4 rounded">
            <SubHeading label="Sales Prediction for Given Month :"/>
            <div className="text-zinc-100 font-bold">{JSON.stringify(data.predictions)}</div>
            </div>
        <Heading></Heading>
        </div>
        </div>
        

    )
}