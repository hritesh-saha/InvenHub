import { useState } from "react"
import {BsArrowLeftShort} from "react-icons/bs"
import { FaWallet } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { FaHouse } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { MdBarChart } from "react-icons/md";
import { FaBox } from "react-icons/fa";
import { IoIosListBox } from "react-icons/io";

export default function Sidebar(){
    const [open,setOpen]=useState(true);
    return(
        <div className={`bg-zinc-50 h-screen p-5 pt-8 duration-300 ${open ?"w-60":"w-20"} relative`}>
            <BsArrowLeftShort className={`bg-white text-black text-3xl rounded-full absolute -right-3 top-9 border border-black cursor-pointer ${open?"rotate-0":"rotate-180"}`} onClick={()=>setOpen(!open)}/>
                <div className="inline-flex">
                <FaHouse className={`text-stone-500 text-4xl rounded cursor-pointer block float-left mr-2 duration-300`} />
                <h1 className={`origin-left font-medium text-xl duration-300 ${!open && "scale-0"}`}>Dashboard</h1>
                
                </div>
                <div className="inline-flex pt-4">
                <FaShoppingCart className={`text-stone-500 text-4xl rounded cursor-pointer block float-left mr-2 duration-300`}/>
                <h1 className={`origin-left font-medium text-xl duration-300 ${!open && "scale-0"}`}>Inventory</h1>
                </div>
                <div className="inline-flex pt-4">
                <MdBarChart className={`text-stone-500 text-4xl rounded cursor-pointer block float-left mr-2 duration-300`}/>
                <h1 className={`origin-left font-medium text-xl duration-300 ${!open && "scale-0"}`}>Reports</h1>
                </div>
                <div className="inline-flex pt-4">
                <FaBox className={`text-stone-500 text-4xl rounded cursor-pointer block float-left mr-2 duration-300`}/>
                <h1 className={`origin-left font-medium text-xl duration-300 ${!open && "scale-0"}`}>Orders</h1>
                </div>
                <div className="inline-flex pt-4">
                <IoIosListBox className={`text-stone-500 text-4xl rounded cursor-pointer block float-left mr-2 duration-300`}/>
                <h1 className={`origin-left font-medium text-xl duration-300 ${!open && "scale-0"}`}>NewSale</h1>
                </div>
        </div>

    )
}