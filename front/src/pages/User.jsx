import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Signout } from "../components/Signout";

export function User(){
    return(
        <div className="bg-zinc-100 h-screen">
            <Signout />
      
      {/* Render Navbar on mobile (hidden on large screens) */}
      <div className="lg:hidden">
        <Navbar />
      </div>
      
      <div className="flex">
        {/* Render Sidebar on larger screens (hidden on mobile) */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
            <div className="flex flex-col bg-white rounded-2xl m-3 w-96 p-3">
                <h3 className="font-bold text-2xl pt-4 ">Avirup Ghosal</h3>
                <h3 className="font-bold text-slate-400 text-xl pb-2 ">abc@gmail.com</h3>
                <div className="py-5 border-b-2">Name <span className="float-right text-slate-400">Avirup</span></div>
                <div className="py-5 border-b-2">Email account <span className="float-right text-slate-400">abc@gmail.com</span></div>
                <div className="py-5 border-b-2">Phone number <span className="float-right text-slate-400">123456789</span></div>
                <div className="py-5">Location <span className="float-right text-slate-400">Ohio</span></div>

            </div>
        </div>
        </div>
    )

}