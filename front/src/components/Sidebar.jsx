import { useState } from "react"
import {BsArrowLeftShort} from "react-icons/bs"
import { FaWallet } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { IoLogoWechat } from "react-icons/io5";
import { MdOnlinePrediction } from "react-icons/md";
import { FaHouse } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { MdBarChart } from "react-icons/md";
import { FaBox } from "react-icons/fa";
import { FaProductHunt } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { GrDocumentUpdate } from "react-icons/gr";
import { Signout } from "../components/Signout";
export default function Sidebar(){
    const [open,setOpen]=useState(true);
    return(
        <div className={`flex flex-col bg-zinc-50 min-h-full p-5 pt-8 duration-300 ${open ?"w-60":"w-20"} relative`}>
            <BsArrowLeftShort className={`bg-white text-black text-3xl rounded-full absolute -right-3 top-9 border border-black cursor-pointer ${open?"rotate-0":"rotate-180"}`} onClick={()=>setOpen(!open)}/>
                <div className="inline-flex">
                <a href="/dashboard">
                <FaHouse className={`text-stone-500 text-4xl rounded cursor-pointer block float-left mr-2 duration-300`} />
                <h1 className={`origin-left font-medium text-xl duration-300 ${!open && "scale-0"}`}>Dashboard</h1>
                </a>
                
                </div>
                <div className="inline-flex pt-4">
                <a href="/inventory">
                <FaShoppingCart href="/inventory" className={`text-stone-500 text-4xl rounded cursor-pointer block float-left mr-2 duration-300`}/>
                <h1 className={`origin-left font-medium text-xl duration-300 ${!open && "scale-0"}`}>Inventory</h1>
                </a>
                </div>
                <div className="inline-flex pt-4">
                <a href="/products">
                <FaProductHunt className={`text-stone-500 text-4xl rounded cursor-pointer block float-left mr-2 duration-300`}/>
                <h1 className={`origin-left font-medium text-xl duration-300 ${!open && "scale-0"}`}>Products</h1>
                </a>
                </div>
                <div className="inline-flex pt-4">
                <a href="/update">
                <GrDocumentUpdate className={`text-stone-500 text-4xl rounded cursor-pointer block float-left mr-2 duration-300`}/>
                <h1 className={`origin-left font-medium text-xl duration-300 ${!open && "scale-0"}`}>Update</h1>
                </a>
                </div>
                <div className="inline-flex pt-4">
                <a href="/user">
                <FaUserAlt className={`text-stone-500 text-4xl rounded cursor-pointer block float-left mr-2 duration-300`}/>
                <h1 className={`origin-left font-medium text-xl duration-300 ${!open && "scale-0"}`}>User</h1>
                </a>
                </div>
                <div className="inline-flex pt-4">
                <a href="/predict">
                <MdOnlinePrediction className={`text-stone-500 text-4xl rounded cursor-pointer block float-left mr-2 duration-300`}/>
                <h1 className={`origin-left font-medium text-xl duration-300 ${!open && "scale-0"}`}>Predict</h1>
                </a>
                </div>
                <div className="inline-flex pt-4">
                <a href="/ai">
                <IoLogoWechat className={`text-stone-500 text-4xl rounded cursor-pointer block float-left mr-2 duration-300`}/>
                <h1 className={`origin-left font-medium text-xl duration-300 ${!open && "scale-0"}`}>ChatBot</h1>
                </a>
                </div>
                <div className="inline-flex pt-4">
                    <Signout/>
                </div>
                
                <div className="inline-flex pt-4">
                </div>
        </div>

    )
}