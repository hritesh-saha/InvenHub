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



// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";  // Import Navbar
// import Sidebar from "../components/Sidebar";
// import Heading from "../components/Heading";
// import axios from "axios";
// import moment from "moment";
// import { Signout } from "../components/Signout";
// import SubHeading from "../components/SubHeading";
// // import SalesLineChart from "../components/SalesLineChart";

// export default function Dashboard() {
//   const [products, setProducts] = useState([]);
//   const [email,setemail]=useState("");
  
//   useEffect(() => {
//     const storedEmail =JSON.parse(localStorage.getItem("email"));
//     setemail(storedEmail);
//     if (storedEmail) {
//       setemail(storedEmail); // Set the email from localStorage
//     } else {
//       console.error("Email not found in localStorage");
//     } // Set the email from localStorage
//   }, []);
//   const fetchProducts = async () => {
//     try {
//       if (email) {
//         const response = await axios.get(
//           `https://inven-hub-backend.vercel.app/product?email=${email}`
//         );
//         setProducts(response.data);
//       }
        
//     } catch (error) {
//         console.error("Error fetching products:", error);
//     }
// };

//   useEffect(() => {
//     fetchProducts();
// }, [email]);

// const sortedProducts = [...products].sort((a, b) => b.selling_price - a.selling_price);

//   return (
//     <>
//       <Signout />
      
//       {/* Render Navbar on mobile (hidden on large screens) */}
//       <div className="lg:hidden">
//         <Navbar />
//       </div>
      
//       <div className="flex">
//         {/* Render Sidebar on larger screens (hidden on mobile) */}
//         <div className="hidden lg:block">
//           <Sidebar />
//         </div>
        
//         {/* Main content that stays visible on all screen sizes */}
//         <div className="flex flex-col p-5 items-center lg:w-4/5 w-full">
//           <SubHeading label="Sales Overview" />
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
//           <div className="hidden md:flex flex-row p-2 border-b font-bold">
//               <div className="w-1/6 text-center">Name</div>
//               <div className="w-1/6 text-center">Cost Price</div>
//               <div className="w-1/6 text-center">Selling Price</div>
//               <div className="w-1/6 text-center">Manufacturing Date</div>
//               <div className="w-1/6 text-center">Expiry Date</div>
//               <div className="w-1/6 text-center">Batch Number</div>
//             </div>
//           </div>
//           {sortedProducts.length > 0 ? (
//               sortedProducts.map((product) => (
//                 <div key={product.id} className="p-4 border-b">
//                   {/* Mobile View (stacks details vertically) */}
//                   <div className="flex flex-col space-y-2 md:hidden">
//                     <div className="text-sm font-semibold">Name: <span className="font-normal">{product.name}</span></div>
//                     <div className="text-sm font-semibold">Cost Price: <span className="font-normal">{product.cost_price}</span></div>
//                     <div className="text-sm font-semibold">Selling Price: <span className="font-normal">{product.selling_price}</span></div>
//                     <div className="text-sm font-semibold">Manufacturing Date: <span className="font-normal">{moment(product.manufacture_date).format("DD/MM/YYYY")}</span></div>
//                     <div className="text-sm font-semibold">Expiry Date: <span className="font-normal">{moment(product.expiry_date).format("DD/MM/YYYY")}</span></div>
//                     <div className="text-sm font-semibold">Batch Number: <span className="font-normal">{product.batch_number}</span></div>
//                   </div>

//                   {/* Larger screen (table format) */}
//                   <div className="hidden md:flex flex-row">
//                     <div className="w-1/6 text-center">{product.name}</div>
//                     <div className="w-1/6 text-center">{product.cost_price}</div>
//                     <div className="w-1/6 text-center">{product.selling_price}</div>
//                     <div className="w-1/6 text-center">{moment(product.manufacture_date).format("DD/MM/YYYY")}</div>
//                     <div className="w-1/6 text-center">{moment(product.expiry_date).format("DD/MM/YYYY")}</div>
//                     <div className="w-1/6 text-center">{product.batch_number}</div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center">No products available</p>
//             )}

//           {/*<SubHeading label="Sales & Purchase" />
//           <SalesLineChart salesData={sortedProducts} />  Pass sortedProducts to the line chart */}
//           <SubHeading label="Top Selling Stock" />
//           <div className="bg-white flex flex-col w-full p-5">

//             {/* Table Header for larger screens */}
//             <div className="hidden md:flex flex-row p-2 border-b font-bold">
//               <div className="w-1/6 text-center">Name</div>
//               <div className="w-1/6 text-center">Cost Price</div>
//               <div className="w-1/6 text-center">Selling Price</div>
//               <div className="w-1/6 text-center">Manufacturing Date</div>
//               <div className="w-1/6 text-center">Expiry Date</div>
//               <div className="w-1/6 text-center">Batch Number</div>
//             </div>

//             {/* Product List */}
//             {sortedProducts.length > 0 ? (
//               sortedProducts.map((product) => (
//                 <div key={product.id} className="p-4 border-b">
//                   {/* Mobile View (stacks details vertically) */}
//                   <div className="flex flex-col space-y-2 md:hidden">
//                     <div className="text-sm font-semibold">Name: <span className="font-normal">{product.name}</span></div>
//                     <div className="text-sm font-semibold">Cost Price: <span className="font-normal">{product.cost_price}</span></div>
//                     <div className="text-sm font-semibold">Selling Price: <span className="font-normal">{product.selling_price}</span></div>
//                     <div className="text-sm font-semibold">Manufacturing Date: <span className="font-normal">{moment(product.manufacture_date).format("DD/MM/YYYY")}</span></div>
//                     <div className="text-sm font-semibold">Expiry Date: <span className="font-normal">{moment(product.expiry_date).format("DD/MM/YYYY")}</span></div>
//                     <div className="text-sm font-semibold">Batch Number: <span className="font-normal">{product.batch_number}</span></div>
//                   </div>

//                   {/* Larger screen (table format) */}
//                   <div className="hidden md:flex flex-row">
//                     <div className="w-1/6 text-center">{product.name}</div>
//                     <div className="w-1/6 text-center">{product.cost_price}</div>
//                     <div className="w-1/6 text-center">{product.selling_price}</div>
//                     <div className="w-1/6 text-center">{moment(product.manufacture_date).format("DD/MM/YYYY")}</div>
//                     <div className="w-1/6 text-center">{moment(product.expiry_date).format("DD/MM/YYYY")}</div>
//                     <div className="w-1/6 text-center">{product.batch_number}</div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center">No products available</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";  // Import Navbar
import Sidebar from "../components/Sidebar";
import Heading from "../components/Heading";
import axios from "axios";
import moment from "moment";
import { Signout } from "../components/Signout";
import SubHeading from "../components/SubHeading";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = JSON.parse(localStorage.getItem("email"));
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      console.error("Email not found in localStorage");
    }
  }, []);

  const fetchProducts = async () => {
    try {
      if (email) {
        const response = await axios.get(
          `https://inven-hub-backend.vercel.app/product?email=${email}`
        );
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [email]);

  const sortedProducts = [...products].sort(
    (a, b) => b.selling_price - a.selling_price
  );

  return (
    <>

      {/* Render Navbar on mobile (hidden on large screens) */}
      <div className="lg:hidden">
        <Navbar />
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Render Sidebar on larger screens (hidden on mobile) */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="flex flex-col p-5 items-center lg:w-4/5 w-full">
          <SubHeading label="Sales Overview" />

          <div className="bg-white flex flex-col w-full p-5">
            {/* Table Header for larger screens */}
            <div className="hidden md:flex flex-row p-2 border-b font-bold">
              <div className="w-1/6 text-center">Name</div>
              <div className="w-1/6 text-center">Sales</div>
              <div className="w-1/6 text-center">Revenue</div>
              <div className="w-1/6 text-center">Profit</div>
              <div className="w-1/6 text-center">Cost</div>
            
            </div>

            {/* Product List */}
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <div key={product.id} className="p-4 border-b">
                  {/* Mobile View (stacks details vertically) */}
                  <div className="flex flex-col space-y-2 md:hidden">
                    <div className="text-sm font-semibold">
                      Name: <span className="font-normal">{product.name}</span>
                    </div>
                    <div className="text-sm font-semibold">
                      Sales:{" "}
                      <span className="font-normal">{product.sale}</span>
                    </div>
                    <div className="text-sm font-semibold">
                      Revenue:{" "}
                      <span className="font-normal">{product.stock_selling_price}</span>
                    </div>
                    <div className="text-sm font-semibold">
                      Profit:{" "}
                      <span className="font-normal">
                      {product.stock_profit}
                      </span>
                    </div>
                    <div className="text-sm font-semibold">
                      Cost:{" "}
                      <span className="font-normal">
                      {product.stock_cost}
                      </span>
                    </div>
                    
                  </div>

                  {/* Larger screen (table format) */}
                  <div className="hidden md:flex flex-row">
                    <div className="w-1/6 text-center">{product.name}</div>
                    <div className="w-1/6 text-center">{product.sale}</div>
                    <div className="w-1/6 text-center">{product.stock_selling_price}</div>
                    <div className="w-1/6 text-center">
                    {product.stock_profit}
                    </div>
                    <div className="w-1/6 text-center">
                    {product.stock_cost}
                    </div>
                    
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No products available</p>
            )}
          </div>
          {/* Sales and Purchase Section (Optional) */}
          {/*<SubHeading label="Sales & Purchase" />
          <SalesLineChart salesData={sortedProducts} />*/}

          <SubHeading label="Top Selling Stock" />
          <div className="bg-white flex flex-col w-full p-5">
            {/* Table Header for larger screens */}
            <div className="hidden md:flex flex-row p-2 border-b font-bold">
              <div className="w-1/6 text-center">Name</div>
              <div className="w-1/6 text-center">Cost Price</div>
              <div className="w-1/6 text-center">Selling Price</div>
              <div className="w-1/6 text-center">Manufacturing Date</div>
              <div className="w-1/6 text-center">Expiry Date</div>
              <div className="w-1/6 text-center">Batch Number</div>
            </div>

            {/* Product List */}
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <div key={product.id} className="p-4 border-b">
                  {/* Mobile View (stacks details vertically) */}
                  <div className="flex flex-col space-y-2 md:hidden">
                    <div className="text-sm font-semibold">
                      Name: <span className="font-normal">{product.name}</span>
                    </div>
                    <div className="text-sm font-semibold">
                      Cost Price:{" "}
                      <span className="font-normal">{product.cost_price}</span>
                    </div>
                    <div className="text-sm font-semibold">
                      Selling Price:{" "}
                      <span className="font-normal">{product.selling_price}</span>
                    </div>
                    <div className="text-sm font-semibold">
                      Manufacturing Date:{" "}
                      <span className="font-normal">
                        {moment(product.manufacture_date).format("DD/MM/YYYY")}
                      </span>
                    </div>
                    <div className="text-sm font-semibold">
                      Expiry Date:{" "}
                      <span className="font-normal">
                        {moment(product.expiry_date).format("DD/MM/YYYY")}
                      </span>
                    </div>
                    <div className="text-sm font-semibold">
                      Batch Number:{" "}
                      <span className="font-normal">{product.batch_number}</span>
                    </div>
                  </div>

                  {/* Larger screen (table format) */}
                  <div className="hidden md:flex flex-row">
                    <div className="w-1/6 text-center">{product.name}</div>
                    <div className="w-1/6 text-center">{product.cost_price}</div>
                    <div className="w-1/6 text-center">{product.selling_price}</div>
                    <div className="w-1/6 text-center">
                      {moment(product.manufacture_date).format("DD/MM/YYYY")}
                    </div>
                    <div className="w-1/6 text-center">
                      {moment(product.expiry_date).format("DD/MM/YYYY")}
                    </div>
                    <div className="w-1/6 text-center">{product.batch_number}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No products available</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
