import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('Laptop');
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState('price');
  const [order, setOrder] = useState('asc');

  // Function to pull data dynamically based on user selections
  const fetchFilteredData = () => {
    setLoading(true);
    axios.get(`http://localhost:9000/categories/${category}/products`, {
      params: {
        n: 10,
        maxPrice: maxPrice,
        sort: sortBy,
        order: order
      }
    })
    .then(response => {
      setProducts(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error("Backend connection failed:", error);
      setLoading(false);
    });
  };

  // Fetch automatically when filters change
  useEffect(() => {
    fetchFilteredData();
  }, [category, sortBy, order]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ color: '#333' }}>🛒 Top Products Comparator</h1>
      </header>

      {/* Control Panel / Filter Bar */}
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }}>
            <option value="Laptop">Laptops</option>
            <option value="Phone">Phones</option>
            <option value="TV">TVs</option>
            <option value="Earphone">Earphones</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Sort By:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }}>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="discount">Discount</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Order:</label>
          <select value={order} onChange={(e) => setOrder(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }}>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid List View */}
      {loading ? (
        <h3 style={{ textAlign: 'center', color: '#666' }}>Fetching optimized payload...</h3>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {products.map((product, idx) => (
            <div key={idx} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#222' }}>{product.productName}</h3>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2e7d32', marginBottom: '10px' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                ⭐ Rating: <span style={{ fontWeight: 'bold', color: '#333' }}>{product.rating}</span> / 5
              </div>
              <div style={{ fontSize: '14px', color: '#c62828', marginBottom: '10px', fontWeight: '500' }}>
                📉 {product.discount}% OFF
              </div>
              <span style={{ 
                display: 'inline-block', 
                padding: '4px 8px', 
                borderRadius: '4px', 
                fontSize: '12px', 
                fontWeight: 'bold',
                backgroundColor: product.availability === 'yes' ? '#e8f5e9' : '#ffebee',
                color: product.availability === 'yes' ? '#2e7d32' : '#c62828'
              }}>
                {product.availability === 'yes' ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;