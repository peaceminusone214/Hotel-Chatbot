const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");

// Webhook GET (verify)
router.get("/", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// Webhook POST (tin nhắn)
router.post("/", async (req, res) => {
  const body = req.body;

  // FACEBOOK webhook
  if (body.object === "page") {
    for (const entry of body.entry || []) {
      const messaging = entry.messaging?.[0];
      const message = messaging?.message?.text;
      const sender_id = messaging?.sender?.id;
      const page_id = entry?.id;

      if (!message || !sender_id || !page_id) continue;

      const payload = {
        platform: "facebook",
        sender_id,
        page_id,
        message,
      };

      const result = await chatbotController.handleMessage(payload);

      if (result?.error) {
        console.warn("Lỗi xử lý:", result.error);
        return res.status(result.code || 500).json({ message: result.error });
      }
    }

    return res.sendStatus(200); // ✅ chỉ phản hồi sau khi xong hết
  }

  return res.sendStatus(404);
});

module.exports = router;
