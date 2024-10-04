import React, { useState } from 'react';
import axios from 'axios';

export default function SearchPage() {
  const [query, setQuery] = useState(''); // To store search query
  const [results, setResults] = useState([]); // To store search results
  const [email, setEmail] = useState(localStorage.getItem('email')); // Email from localStorage or set it appropriately
  const [loading, setLoading] = useState(false); // To show a loading spinner during the request
  const [error, setError] = useState(null); // To capture any errors

  const handleSearch = async () => {
    setLoading(true); // Start loading
    setError(null); // Clear previous error
    try {
      const response = await axios.get('https://inven-hub-backend.vercel.app/search', {
        params: { query, email },
      });
      console.log(response.data);
      setResults(response.data); // Set the search results
    } catch (err) {
      setError('Error fetching search results'); // Set error if request fails
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Search Products</h1>

      <div className="mb-5">
        {/* Search Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white rounded p-2 mt-2"
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Render Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Render Search Results */}
      <div className="mt-5">
        {results.length > 0 ? (
          <ul>
          {results.map((product, index) => (
            <li key={index} className="border-b py-2">
              <h3 className="text-3xl font-medium text-gray-700 leading-snug">{product.name}</h3>
              <p className="text-2xl font-medium text-gray-700 leading-snug">Cost Price: {product.cost_price}</p>
              <p className="text-2xl font-medium text-gray-700 leading-snug">Selling Price: {product.selling_price}</p>
              <p className="text-2xl font-medium text-gray-700 leading-snug">Sale: {product.sale}</p>
              <p className="text-2xl font-medium text-gray-700 leading-snug">Manufacture Date: {new Date(product.manufacture_date).toLocaleDateString()}</p>
              <p className="text-2xl font-medium text-gray-700 leading-snug">Expiry Date: {new Date(product.expiry_date).toLocaleDateString()}</p>
              <p className="text-2xl font-medium text-gray-700 leading-snug">Batch Number: {product.batch_number || 'N/A'}</p>
            </li>
          ))}
        </ul>
        
        ) : (
          !loading && <p>No results found</p> // Show "No results" only if not loading
        )}
      </div>
    </div>
  );
}
