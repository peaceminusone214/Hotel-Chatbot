const axios = require("axios");

exports.sendMessage = async (pageToken, recipientId, message) => {
  return axios.post(
    "https://graph.facebook.com/v19.0/me/messages",
    {
      recipient: { id: recipientId },
      message: { text: message },
    },
    {
      params: { access_token: pageToken },
    }
  );
};
