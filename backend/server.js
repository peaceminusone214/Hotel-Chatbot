require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');

app.use(express.json());
// Serve file tĩnh cho xác minh Zalo
app.use('/zalo', express.static(path.join(__dirname, 'public/zalo')));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

// Routes
const webhookRoutes = require('./routes/webhook.route');
app.use('/webhook', webhookRoutes);
const chatbotRoutes = require("./routes/chatbot.route");
app.use("/chatbot", chatbotRoutes);
const zaloWebhook = require("./routes/zaloWebhook.route");
app.use("/zalo/webhook", zaloWebhook);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
