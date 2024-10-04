import { useState } from "react";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import { Signout } from "../components/Signout";
import { PiPaperPlaneRightFill } from "react-icons/pi";
import axios from "axios";


export default function AI(){
    const [inputValue, setInputValue] = useState("");
    const [answer,setanswer]=useState("")
    const handleAsk=async ()=>{
        const query=inputValue;
        try{
            const response=await axios.post("https://inven-hub-backend.vercel.app/chatbot",{
                query
            });
            console.log(response.data.response);
            setanswer(response.data.response);
        }catch(error){
            console.log("Something went wrong");
        }
        

    }

    return(
        <div className="min-h-screen bg-zinc-100 flex flex-col justify-center">
      <Navbar />
      
      <div className="flex flex-col justify-center items-center">
      <div className="rounded-lg bg-white w-1/2 min-h-screen p-4 flex flex-col justify-between">
        <Heading label="AI" color="text-white" />
        {answer}
        {/* Other content can go here */}
        <div className="flex-grow">
          {/* Empty space or other elements */}
        </div>
        <div className="flex flex-row">
          <input
            type="text"
            id="input-box"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 w-full bg-inherit"
            placeholder="Ask me anything..."
          />
          <PiPaperPlaneRightFill 
            onClick={handleAsk} // Call handleSubmit when clicked
            size={30} 
            color="grey" 
            className="cursor-pointer"
          />
        </div>
      </div>
      </div>
    </div>
    )
}