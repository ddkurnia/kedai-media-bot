const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ===== CONFIG =====
const VERIFY_TOKEN = "kedaimedia";
const WHATSAPP_TOKEN = "EAARwNbUXAHgBQwNTfbkIKmXLBYYj0CJjCbEUhCBbO0dhoGpvnMuq0NUUmxof5dtlhRSsscbtWdaYAPbC9wZCg2jGzTlfIzCIi9yNzehCb25H1pHZCVQp58dXUdDzmsoT3TWSbn4M9r7RhJXpKN0Q9GfZAgKI9amUmGMPnGEVMEOpmZCawGlApilrnKGfDQ7NpT3GSBwK6QOzKZCRw6Qqby9STzYr5szFr5T6vH9CQHp21HgdW57xLzZATgZCbAmVQuZApozXWIZBRZAmKlS1C0uSL6s8CpDfo7VuKw6TcZD";
const PHONE_NUMBER_ID = "952598557943860";

// ===== ROOT =====
app.get("/", (req, res) => {
  res.send("Kedai Media Bot Aktif");
});

// ===== WEBHOOK VERIFY =====
app.get("/webhook", (req, res) => {

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }

});

// ===== RECEIVE MESSAGE =====
app.post("/webhook", async (req, res) => {

  try {

    const body = req.body;

    if (body.object) {

      const message =
        body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      if (message) {

        const from = message.from;
        const text = message.text?.body?.toLowerCase() || "";

        await sendMenu(from);

      }

      res.sendStatus(200);

    } else {
      res.sendStatus(404);
    }

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }

});

// ===== SEND MENU =====
async function sendMenu(to) {

  await axios.post(
    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: {
        body:
          "Halo, selamat datang di Kedai Media.\n\n" +
          "Pilih layanan:\n\n" +
          "1. Followers Instagram\n" +
          "2. Followers TikTok\n" +
          "3. Subscribers YouTube\n" +
          "4. WhatsApp Automation\n" +
          "5. Website\n" +
          "6. Pemulihan Akun\n" +
          "7. Keamanan Akun\n\n" +
          "Admin: wa.me/6282285781863\n" +
          "Website: https://ddkurnia.github.io/kedai-media/"
      }
    },
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

}

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
