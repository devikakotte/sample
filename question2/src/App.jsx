import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Calling your local backend microservice directly
    axios.get('http://localhost:9000/categories/Laptop/products?n=5&sort=price&order=asc')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error connecting to local backend server:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Top Products Comparison Dashboard</h1>
      {loading ? (
        <p>Loading optimized backend payload...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {products.map((item, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
              <h3>{item.productName}</h3>
              <p>💰 Price: ₹{item.price} | ⭐ Rating: {item.rating} | 🏷️ Discount: {item.discount}%</p>
              <p>📦 Availability: <strong>{item.availability}</strong></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;