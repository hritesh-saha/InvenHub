
// import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import SubHeading from "../components/SubHeading";
// import Heading from "../components/Heading";
// import axios from "axios";
// import moment from "moment";

// export function Inventory() {
//     const [products, setProducts] = useState([]);

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const response = await axios.get("https://inven-hub-backend.vercel.app/product");
//                 setProducts(response.data);
//             } catch (error) {
//                 console.error("Error fetching products:", error);
//             }
//         };
//         fetchProducts();
//     }, []); 

//     return (
//         <div className="flex bg-zinc-100 w-screen">
//             <Sidebar />
//             <div className="flex p-5 items-center flex-col w-full">
//                 <div className="bg-white flex flex-col w-full p-5 my-5">
//                     <div className="flex justify-center"><SubHeading label="Overall Inventory" /></div>
//                     <div className="flex flex-row justify-between my-4">
//                         <div className="px-8 h-20 border-r-2 mb-3 text-blue-500">Categories <br /> value</div>
//                         <div className="px-8 h-20 border-r-2 mb-3 text-yellow-400">Total Products <br /> value</div>
//                         <div className="px-8 h-20 mb-3 text-fuchsia-500">Top Selling <br /> value</div>
//                     </div>
//                 </div>

//                 <div className="bg-white flex flex-col w-full p-5">
//                     <div className="flex justify-center mb-5"><Heading label="Product List" /></div>
//                     <div className="flex flex-row p-2 border-b font-bold">
//                         <div className="w-1/6 text-center">Name</div>
//                         <div className="w-1/6 text-center">Cost Price</div>
//                         <div className="w-1/6 text-center">Selling Price</div>
//                         <div className="w-1/6 text-center">Manufacturing Date</div>
//                         <div className="w-1/6 text-center">Expiry Date</div>
//                         <div className="w-1/6 text-center">Batch Number</div>
//                     </div>

//                     {products.length > 0 ? (
//                         products.map((product) => (
//                             <div key={product.id} className="flex flex-row p-2 border-b">
//                                 <div className="w-1/6 text-center">{product.name}</div>
//                                 <div className="w-1/6 text-center">{product.cost_price}</div>
//                                 <div className="w-1/6 text-center">{product.selling_price}</div>
//                                 <div className="w-1/6 text-center">{moment(product.manufacture_date).format("DD/MM/YYYY")}</div>
//                                 <div className="w-1/6 text-center">{moment(product.expiry_date).format("DD/MM/YYYY")}</div>
//                                 <div className="w-1/6 text-center">{product.batch_number}</div>
//                             </div>
//                         ))
//                     ) : (
//                         <p>No products available</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";  // Import Navbar
import SubHeading from "../components/SubHeading";
import Heading from "../components/Heading";
import axios from "axios";
import moment from "moment";
import { Signout } from "../components/Signout";

export function Inventory() {
  const [products, setProducts] = useState([]);
  const [email,setemail]=useState("");

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            setemail(localStorage.getItem("email"));
            const response = await axios.get("https://inven-hub-backend.vercel.app/product",{
                params: { email: email }
            });
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };
    fetchProducts();
}, [email]);

 // Calculate Total Sales, Total Products Value, and Top Selling
 const totalSales = products.reduce((sum, product) => sum + product.sale, 0);
 const totalProductsValue = products.reduce((sum, product) => sum + product.cost_price, 0);
 const topSelling = products.length > 0 ? Math.max(...products.map(product => product.selling_price)) : 0;

  return (
    <div className="bg-zinc-100">
      
      {/* Render Navbar on mobile (hidden on large screens) */}
      <div className="lg:hidden">
        <Navbar />
      </div>
      
      <div className="flex">
        {/* Render Sidebar on larger screens (hidden on mobile) */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="flex p-5 items-center flex-col w-full">
          <div className="bg-white flex flex-col w-full p-5 my-5">
            <div className="flex justify-center"><SubHeading label="Overall Inventory" /></div>
            <div className="flex flex-col md:flex-row justify-between my-4">
              <div className="px-8 h-20 border-r-0 md:border-r-2 mb-3 text-blue-500 text-center md:text-left">Total Products <br /> {totalProductsValue}</div>
              <div className="px-8 h-20 border-r-0 md:border-r-2 mb-3 text-yellow-400 text-center md:text-left">Total Sales <br /> {totalSales}</div>
              <div className="px-8 h-20 mb-3 text-fuchsia-500 text-center md:text-left">Top Selling <br /> {topSelling}</div>
            </div>
          </div>

          <div className="bg-white flex flex-col w-full p-5">
            <div className="flex justify-center mb-5"><Heading label="Product List" /></div>

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
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="p-4 border-b">
                  {/* Mobile View (stacks details vertically) */}
                  <div className="flex flex-col space-y-2 md:hidden">
                    <div className="text-sm font-semibold">Name: <span className="font-normal">{product.name}</span></div>
                    <div className="text-sm font-semibold">Cost Price: <span className="font-normal">{product.cost_price}</span></div>
                    <div className="text-sm font-semibold">Selling Price: <span className="font-normal">{product.selling_price}</span></div>
                    <div className="text-sm font-semibold">Manufacturing Date: <span className="font-normal">{moment(product.manufacture_date).format("DD/MM/YYYY")}</span></div>
                    <div className="text-sm font-semibold">Expiry Date: <span className="font-normal">{moment(product.expiry_date).format("DD/MM/YYYY")}</span></div>
                    <div className="text-sm font-semibold">Batch Number: <span className="font-normal">{product.batch_number}</span></div>
                  </div>

                  {/* Larger screen (table format) */}
                  <div className="hidden md:flex flex-row">
                    <div className="w-1/6 text-center">{product.name}</div>
                    <div className="w-1/6 text-center">{product.cost_price}</div>
                    <div className="w-1/6 text-center">{product.selling_price}</div>
                    <div className="w-1/6 text-center">{moment(product.manufacture_date).format("DD/MM/YYYY")}</div>
                    <div className="w-1/6 text-center">{moment(product.expiry_date).format("DD/MM/YYYY")}</div>
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
    </div>
  );
}
