import { useState } from "react";
import Button from "../components/Button";
import Heading from "../components/Heading";
import Inputbox from "../components/Inputbox";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Otp(){
    const navigate=useNavigate();
    const[otp,setotp]=useState();
    const [error, setError] = useState("");
    const HandleSendOtp=async ()=>{
        if (!otp) {
            setError("Otp is required.");
            return;
        }
        
        setError("");
          try {
        const response=await axios.post("https://inven-hub-backend.vercel.app/verify-otp",
            {
                otp
            });
            if (response.status === 200){
                navigate("/dashboard");
            }else{
                localStorage.removeItem("email");
                navigate("/signup");
            }}catch(error){
                localStorage.removeItem("email");
                console.error("Error during OTP verification:", error);
                setError("An error occurred. Please try again.");
                navigate("/signup");
            }

    }
    return(
        <div className="bg-zinc-100 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-zinc-600 border-4 border-gray-200 w-80 text-center p-2 h-max px-4">
            <Heading label="Otp"></Heading>
            <Inputbox type="number" label="" placeholder="otp" onChange={(e) => setotp(e.target.value)}></Inputbox>
            {error && <p className="text-red-500">{error}</p>}
            <Button label="Send Otp" onClick={HandleSendOtp}></Button>
        </div>
        </div>
        </div>
        )
}