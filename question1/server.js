const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 9000;

// Set this to TRUE right now while practicing. Turn it to FALSE on exam day!
const IS_MOCK_MODE = true; 

const TEST_SERVER_BASE_URL = "http://20.244.56.144/test";

app.use(express.json());

// Main Dynamic Endpoint matching guidelines: GET /categories/:categoryName/products
app.get('/categories/:categoryName/products', async (req, res) => {
    try {
        const { categoryName } = req.params;
        
        // 1. Destructure and sanitize all evaluation parameters
        const n = parseInt(req.query.n) || 10;
        const minPrice = parseInt(req.query.minPrice) || 0;
        const maxPrice = parseInt(req.query.maxPrice) || 1000000;
        const sort = req.query.sort; // e.g., 'price', 'rating', 'discount'
        const order = req.query.order || 'asc';

        let rawProducts = [];

        if (IS_MOCK_MODE) {
            console.log(`[MOCK ENGINE] Simulating responses for ${categoryName}...`);
            // Simulating dirty, overlapping data from multiple e-commerce sources
            rawProducts = [
                { productName: "Premium Laptop Pro", price: 55000, rating: 4.7, discount: 12, availability: "yes" },
                { productName: "Budget Chromebook", price: 15000, rating: 3.9, discount: 5, availability: "yes" },
                { productName: "Premium Laptop Pro", price: 55000, rating: 4.7, discount: 12, availability: "yes" }, // Duplicate
                { productName: "Gaming Beast Edition", price: 95000, rating: 4.9, discount: 20, availability: "out of stock" },
                { productName: "Ultrabook Air", price: 42000, rating: 4.2, discount: 8, availability: "yes" }
            ];
        } else {
            // LIVE ASSIGNMENT MODE: Fires off map loops to hit all 5 companies concurrently
            const companies = ["A", "F", "HYN", "AMZ", "WAL"];
            
            const fetchPromises = companies.map(async (company) => {
                try {
                    const url = `${TEST_SERVER_BASE_URL}/companies/${company}/categories/${categoryName}/products/top-${n}/minPrice-${minPrice}/maxPrice-${maxPrice}`;
                    const response = await axios.get(url, {
                        headers: { 'Authorization': `Bearer CHANCE_TOKEN_FROM_AUTH_JS` }
                    });
                    return response.data || [];
                } catch (err) {
                    console.log(`Company ${company} skipped or timed out.`);
                    return [];
                }
            });

            const settledResponses = await Promise.all(fetchPromises);
            rawProducts = settledResponses.flat(); // Merge all sub-arrays into one big list
        }

        // 2. DEDUPLICATION LAYER: Mastered in Day 1 using native Map keys
        const trackingMap = new Map();
        rawProducts.forEach(item => {
            // Using productName as unique identifier key to catch identical items across sources
            trackingMap.set(item.productName, item);
        });
        let uniqueProducts = Array.from(trackingMap.values());

        // 3. MATHEMATICAL PROPERTY-BASED SORTING LAYER
        if (sort) {
            uniqueProducts.sort((a, b) => {
                const valA = a[sort];
                const valB = b[sort];
                return order === 'desc' ? valB - valA : valA - valB;
            });
        }

        // 4. PAGINATION / TOP-N SLICING
        const finalPayload = uniqueProducts.slice(0, n);

        // 5. OUTPUT CLEAN PAYLOAD TO CLIENT
        res.json(finalPayload);

    } catch (error) {
        console.error("Critical error in aggregation lifecycle:", error.message);
        res.status(500).json({ error: "Internal Server Processing Error" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Dedicated Microservice Active on http://localhost:${PORT}`);
});