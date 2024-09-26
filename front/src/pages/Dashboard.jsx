// import Heading from "../components/Heading";
// import Sidebar from "../components/Sidebar";
// import { Signout } from "../components/Signout";
// import SubHeading from "../components/SubHeading";
// export default function Dashboard(){
//     return(
//         <>
//         <Signout></Signout>
//         <div className="flex">
//         <Sidebar></Sidebar>
//         <div className="flex p-5 items-center flex-col">
//         <SubHeading label="Sales Overview"/>
//         <div className="flex flex-row">
//             <div className="px-5">Sales</div>
//             <div className="px-5">Revenue</div>
//             <div className="px-5">Profit</div>
//             <div className="px-5">Cost</div>
            
//         </div>
//         <SubHeading label="Purchase Overview"/>
//         <div className="flex flex-row">
//             <div className="px-5">Sales</div>
//             <div className="px-5">Revenue</div>
//             <div className="px-5">Profit</div>
//             <div className="px-5">Cost</div>
            
//         </div>
//         <SubHeading label="Sales & Purchase"/>
//         <SubHeading label="Top Selling Stock"/>
//         </div>
//         </div>
//         </>
//     )

// }
import Navbar from "../components/Navbar";  // Import Navbar
import Sidebar from "../components/Sidebar";
import { Signout } from "../components/Signout";
import SubHeading from "../components/SubHeading";

export default function Dashboard() {
  return (
    <>
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
        
        {/* Main content that stays visible on all screen sizes */}
        <div className="flex flex-col p-5 items-center lg:w-4/5 w-full">
          <SubHeading label="Sales Overview" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <div className="px-5 py-3 bg-gray-100 text-center">Sales</div>
            <div className="px-5 py-3 bg-gray-100 text-center">Revenue</div>
            <div className="px-5 py-3 bg-gray-100 text-center">Profit</div>
            <div className="px-5 py-3 bg-gray-100 text-center">Cost</div>
          </div>

          <SubHeading label="Purchase Overview" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <div className="px-5 py-3 bg-gray-100 text-center">Sales</div>
            <div className="px-5 py-3 bg-gray-100 text-center">Revenue</div>
            <div className="px-5 py-3 bg-gray-100 text-center">Profit</div>
            <div className="px-5 py-3 bg-gray-100 text-center">Cost</div>
          </div>

          <SubHeading label="Sales & Purchase" />
          <SubHeading label="Top Selling Stock" />
        </div>
      </div>
    </>
  );
}
