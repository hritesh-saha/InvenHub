
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import SubHeading from "../components/SubHeading";
import Heading from "../components/Heading";
import axios from "axios";
import moment from "moment";

export function Inventory() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("https://inven-hub-backend.vercel.app/product");
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []); 

    return (
        <div className="flex bg-zinc-100 w-screen">
            <Sidebar />
            <div className="flex p-5 items-center flex-col w-full">
                <div className="bg-white flex flex-col w-full p-5 my-5">
                    <div className="flex justify-center"><SubHeading label="Overall Inventory" /></div>
                    <div className="flex flex-row justify-between my-4">
                        <div className="px-8 h-20 border-r-2 mb-3 text-blue-500">Categories <br /> value</div>
                        <div className="px-8 h-20 border-r-2 mb-3 text-yellow-400">Total Products <br /> value</div>
                        <div className="px-8 h-20 mb-3 text-fuchsia-500">Top Selling <br /> value</div>
                    </div>
                </div>

                <div className="bg-white flex flex-col w-full p-5">
                    <div className="flex justify-center mb-5"><Heading label="Product List" /></div>
                    <div className="flex flex-row p-2 border-b font-bold">
                        <div className="w-1/6 text-center">Name</div>
                        <div className="w-1/6 text-center">Cost Price</div>
                        <div className="w-1/6 text-center">Selling Price</div>
                        <div className="w-1/6 text-center">Manufacturing Date</div>
                        <div className="w-1/6 text-center">Expiry Date</div>
                        <div className="w-1/6 text-center">Batch Number</div>
                    </div>

                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product.id} className="flex flex-row p-2 border-b">
                                <div className="w-1/6 text-center">{product.name}</div>
                                <div className="w-1/6 text-center">{product.cost_price}</div>
                                <div className="w-1/6 text-center">{product.selling_price}</div>
                                <div className="w-1/6 text-center">{moment(product.manufacture_date).format("DD/MM/YYYY")}</div>
                                <div className="w-1/6 text-center">{moment(product.expiry_date).format("DD/MM/YYYY")}</div>
                                <div className="w-1/6 text-center">{product.batch_number}</div>
                            </div>
                        ))
                    ) : (
                        <p>No products available</p>
                    )}
                </div>
            </div>
        </div>
    );
}
