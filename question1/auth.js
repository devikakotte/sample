const axios = require('axios');

// IMPORTANT: Input your real information received in your invitation email
const REGISTRATION_PAYLOAD = {
    companyName: "gomart", 
    ownerName: "Your Full Name", 
    rollNo: "YOUR_ACTUAL_ROLL_NUMBER", 
    ownerEmail: "your.college@email.edu", 
    accessCode: "YOUR_EMAIL_ACCESS_CODE" 
};

const TEST_SERVER_BASE = "http://20.244.56.144/test";

const authenticateApp = async () => {
    try {
        console.log("1. Registering company with AffordMed Test Server...");
        
        // Post your details to register your application instance
        const registerResponse = await axios.post(`${TEST_SERVER_BASE}/register`, REGISTRATION_PAYLOAD);
        
        const { clientID, clientSecret } = registerResponse.data;
        console.log("✅ Registration Successful!");
        console.log(`Client ID: ${clientID}`);
        console.log(`Client Secret: ${clientSecret}`);
        
        console.log("\n2. Requesting Bearer Access Token...");
        // Trade credentials for a short-lived bearer token
        const authResponse = await axios.post(`${TEST_SERVER_BASE}/auth`, {
            companyName: REGISTRATION_PAYLOAD.companyName,
            clientID: clientID,
            clientSecret: clientSecret,
            ownerEmail: REGISTRATION_PAYLOAD.ownerEmail
        });
        
        console.log("✅ Authorization Successful! Your Token is:");
        console.log(authResponse.data.access_token);

    } catch (error) {
        console.error("❌ Authentication Layer Failed:", error.response ? error.response.data : error.message);
    }
};

authenticateApp();