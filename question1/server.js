const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 9000;

// Base configuration parameters from the exam paper [cite: 142]
const TEST_SERVER_BASE_URL = "http://20.244.56.144/test";

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Main Endpoint: Fetch Top Products across categories 
// URL format: http://localhost:9000/categories/Laptop/products?n=10&minPrice=1&maxPrice=10000
app.get('/categories/:categoryName/products', async (req, res) => {
    try {
        const { categoryName } = req.params;
        
        // Read URL query parameters with fallback defaults [cite: 163, 167, 168]
        const n = parseInt(req.query.n) || 10;
        const minPrice = parseInt(req.query.minPrice) || 0;
        const maxPrice = parseInt(req.query.maxPrice) || 1000000;
        const sort = req.query.sort; // e.g., 'price', 'rating' [cite: 165]
        const order = req.query.order || 'asc'; // 'asc' or 'desc' [cite: 166]

        // Temporary mock source matching the structure of the 5 companies [cite: 171]
        let combinedProducts = [
            { productName: "Laptop AMZ 1", price: 5000, rating: 4.5, discount: 10, availability: "yes" },
            { productName: "Laptop WAL 2", price: 2500, rating: 4.1, discount: 15, availability: "yes" },
            { productName: "Laptop AMZ 1", price: 5000, rating: 4.5, discount: 10, availability: "yes" } // Duplicate
        ];

        // 1. Deduplicate items using a unique tracking Map matching your Day 1 training
        const trackingMap = new Map();
        combinedProducts.forEach(item => {
            trackingMap.set(item.productName, item);
        });
        let uniqueProducts = Array.from(trackingMap.values());

        // 2. Sort mathematically based on selection queries [cite: 177]
        if (sort) {
            uniqueProducts.sort((a, b) => {
                return order === 'desc' ? b[sort] - a[sort] : a[sort] - b[sort];
            });
        }

        // Return clean JSON response array [cite: 184]
        res.json(uniqueProducts.slice(0, n));

    } catch (error) {
        console.error("Processing breakdown:", error.message);
        res.status(500).json({ error: "Internal Server Processing Error" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
});