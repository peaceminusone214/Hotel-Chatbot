const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");

router.post("/test", chatbotController.testMessage);

module.exports = router;
