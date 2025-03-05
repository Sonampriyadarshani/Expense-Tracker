const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const db = require('./config/connectDB');

// Load environment variables
dotenv.config();

// Create Express App
const app = express();



// Middleware
app.use(cors());
app.use(express.json()); 
app.use(morgan('dev'));

// ✅ Debugging log
console.log("✅ Server is setting up routes...");

// ✅ Import Routes
const transactionRoutes = require("./routes/transactionRoutes");
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/users", require('./routes/userRoutes.js')); 

console.log("✅ User Routes Loaded!");

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
