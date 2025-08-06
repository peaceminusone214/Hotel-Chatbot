// zaloWebhook.route.js
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const body = req.body;
  console.log("Zalo Webhook received:", JSON.stringify(body, null, 2));

  res.sendStatus(200); // Phải trả về 200 cho Zalo biết bạn đã nhận thành công
});

module.exports = router;
