import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Signout } from "../components/Signout";
import axios from "axios";

export function User(){
  const [userdata,setuserdata]=useState({});
  const [email,setemail]=useState("");
  useEffect(()=>{
    const fetchuser=async ()=>{
    const storedemail=JSON.parse(localStorage.getItem("email"));
     setemail(storedemail);
     console.log(email);
     try {
      const response = await axios.get(`https://inven-hub-backend.vercel.app/profile?email=${storedemail}`);
      console.log(response.data);
      const cleanedData = JSON.parse(JSON.stringify(response.data).replace(/'/g, ' '));
      setuserdata(cleanedData); 
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
    fetchuser()
  },[])
  
    return(
        <div className="bg-zinc-100 min-h-screen">
      
      {/* Render Navbar on mobile (hidden on large screens) */}
      <div className="lg:hidden">
        <Navbar />
      </div>
      
      <div className="flex">
        {/* Render Sidebar on larger screens (hidden on mobile) */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="flex flex-col bg-white rounded-2xl m-3 p-5 w-full max-w-md">
  <h3 className="font-bold text-2xl pt-4">{userdata?.firstname + " " + userdata?.lastname}</h3>
  <h3 className="font-bold text-slate-400 text-xl pb-2 break-words">
  {userdata?.email}
</h3>

  {/* Name */}
  <div className="py-5 border-b-2 flex justify-between">
    <span>Name</span>
    <span className="text-slate-400">{userdata?.firstname + " " + userdata?.lastname}</span>
  </div>

  {/* Email */}
  <div className="py-5 border-b-2 flex justify-between">
    <span>Email account</span>
    <span className="text-slate-400">{userdata?.email}</span>
  </div>

  {/* Phone number */}
  <div className="py-5 border-b-2 flex justify-between">
    <span>Phone number</span>
    <span className="text-slate-400">{userdata?.phone}</span>
  </div>
</div>

        </div>
        </div>
    )

}