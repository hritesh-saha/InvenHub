import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Inputbox from "../components/Inputbox";
import Button from "../components/Button";
import axios from "axios";
import moment from "moment";
import Sidebar from "../components/Sidebar";

export function Products(){
    const [name, setname] = useState("");
    const [cost_price, setcostprice] = useState("");
    const [selling_price, setsellingprice] = useState("");
    const [sale, setsale] = useState("");
    const [manufacture_date, setdate] = useState("");
    const [expiry_date, setexpiry] = useState("");
    const [products, setproduct] = useState([]);
    const [batch_number, setbatch] = useState("");
    const [error, setError] = useState(""); // State to track errors
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("https://inven-hub-backend.vercel.app/product");
                setproduct(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    const handleAddProduct = async () => {
        // Validation: Check if any of the fields are empty
        if (!name || !cost_price || !selling_price || !sale || !manufacture_date || !expiry_date || !batch_number) {
            setError("All fields are required.");
            return;
        }
        
        setError(""); // Clear error if validation passes

        try {
            const response = await axios.post("https://inven-hub-backend.vercel.app/add-product", {
                name,
                cost_price,
                selling_price,
                manufacture_date,
                expiry_date,
                sale,
                batch_number,
            });
            
            // Reset form values
            setname("");
            setcostprice("");
            setsellingprice("");
            setsale("");
            setdate("");
            setexpiry("");
            setbatch("");

            const updatedResponse = await axios.get("https://inven-hub-backend.vercel.app/product");
            setproduct(updatedResponse.data);

        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    return (
        <div className="bg-zinc-100 flex ">
            <Sidebar />
            <div className="flex flex-row justify-center px-6">
                <div className="bg-white w-96 border-2 border-stone-400">
                    <Heading label="Add Product" />
                    <form>
                        <Inputbox name="name" label="Product Name" onChange={(e) => { setname(e.target.value) }} />
                        <Inputbox name="cost_price" type="number" label="Cost Price" onChange={(e) => { setcostprice(e.target.value) }} />
                        <Inputbox name="selling_price" type="number" label="Sale Price" onChange={(e) => { setsellingprice(e.target.value) }} />
                        <Inputbox name="sale" type="number" label="Sale" onChange={(e) => { setsale(e.target.value) }} />
                        <Inputbox name="manufacture_date" type="date" label="Manufacture Date" onChange={(e) => { setdate(e.target.value) }} />
                        <Inputbox name="expiry_date" type="date" label="Expiry Date" onChange={(e) => { setexpiry(e.target.value) }} />
                        <Inputbox name="batch_number" type="number" label="Batch Number" onChange={(e) => { setbatch(e.target.value) }} />
                        {error && <p className="text-red-500">{error}</p>} {/* Display error if exists */}
                        <Button onClick={handleAddProduct} label="Update Product" />
                    </form>
                </div>
                <div className="bg-white w-96 border-2 border-stone-400">
                    <Heading label="Product List" />
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product.id} className="p-2 border-b">
                                <p><strong>Name:</strong> {product.name}</p>
                                <p><strong>Cost Price:</strong> {product.cost_price}</p>
                                <p><strong>Selling Price:</strong> {product.selling_price}</p>
                                <p><strong>Quantity:</strong> {product.sale}</p>
                                <p><strong>Manufacture Date:</strong> {moment(product.manufacture_date).format("DD/MM/YYYY")}</p>
                                <p><strong>Expiry Date:</strong> {moment(product.expiry_date).format("DD/MM/YYYY")}</p>
                                <p><strong>Batch Number:</strong> {product.batch_number}</p>
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
