const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

/*
========================================
CONFIG
========================================
*/

const VERIFY_TOKEN = "kedaimedia";

const ACCESS_TOKEN = "EAARwNbUXAHgBQwNTfbkIKmXLBYYj0CJjCbEUhCBbO0dhoGpvnMuq0NUUmxof5dtlhRSsscbtWdaYAPbC9wZCg2jGzTlfIzCIi9yNzehCb25H1pHZCVQp58dXUdDzmsoT3TWSbn4M9r7RhJXpKN0Q9GfZAgKI9amUmGMPnGEVMEOpmZCawGlApilrnKGfDQ7NpT3GSBwK6QOzKZCRw6Qqby9STzYr5szFr5T6vH9CQHp21HgdW57xLzZATgZCbAmVQuZApozXWIZBRZAmKlS1C0uSL6s8CpDfo7VuKw6TcZD";

const PHONE_NUMBER_ID = "952598557943860";

const ADMIN_NUMBER = "6282285781863";

/*
========================================
ROOT TEST
========================================
*/

app.get("/", (req, res) => {
  res.send("Kedai Media WhatsApp Bot Aktif");
});

/*
========================================
WEBHOOK VERIFY
========================================
*/

app.get("/webhook", (req, res) => {

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {

    console.log("Webhook verified");
    res.status(200).send(challenge);

  } else {

    res.sendStatus(403);

  }

});

/*
========================================
WEBHOOK RECEIVE MESSAGE
========================================
*/

app.post("/webhook", async (req, res) => {

  try {

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages) {
      return res.sendStatus(200);
    }

    const message = messages[0];
    const from = message.from;
    const text = message.text?.body?.toLowerCase() || "";

    console.log("Message:", text);

    await handleMessage(from, text);

    res.sendStatus(200);

  } catch (error) {

    console.log(error);
    res.sendStatus(500);

  }

});

/*
========================================
HANDLE MESSAGE
========================================
*/

async function handleMessage(to, text) {

  if (
    text === "halo" ||
    text === "hai" ||
    text === "menu" ||
    text === "info"
  ) {

    return sendMenu(to);

  }

  if (text === "1") return sendText(to, "Website mulai Rp 500.000\nLanding Page / Company Profile");
  if (text === "2") return sendText(to, "WhatsApp Automation mulai Rp 300.000\nUntuk bisnis & pemerintah");
  if (text === "3") return sendText(to, "Followers Instagram mulai Rp 25.000 / 1000");
  if (text === "4") return sendText(to, "Followers TikTok mulai Rp 30.000 / 1000");
  if (text === "5") return sendText(to, "Subscribers YouTube mulai Rp 50.000 / 1000");
  if (text === "6") return sendText(to, "Engagement Like / Komentar mulai Rp 10.000");
  if (text === "7") return sendText(to, "Pemulihan akun mulai Rp 150.000");
  if (text === "8") return sendText(to, "Hapus akun mulai Rp 100.000");
  if (text === "9") return sendText(to, "Keamanan akun mulai Rp 200.000");
  if (text === "10") return sendText(to, "Konsultasi gratis\nAdmin akan membantu");

  return;

}

/*
========================================
SEND MENU
========================================
*/

async function sendMenu(to) {

  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

  const data = {

    messaging_product: "whatsapp",

    to: to,

    type: "interactive",

    interactive: {

      type: "button",

      body: {

        text:
`Halo, selamat datang di Kedai Media

Silakan pilih layanan:

1. Website
2. WhatsApp Automation
3. Followers Instagram
4. Followers TikTok
5. Subscribers YouTube
6. Engagement
7. Pemulihan akun
8. Hapus akun
9. Keamanan akun
10. Konsultasi

Kirim angka pilihan Anda.`

      },

      action: {

        buttons: [

          {
            type: "reply",
            reply: {
              id: "website",
              title: "Website"
            }
          },

          {
            type: "reply",
            reply: {
              id: "admin",
              title: "Hubungi Admin"
            }
          },

          {
            type: "reply",
            reply: {
              id: "web",
              title: "Buka Website"
            }
          }

        ]

      }

    }

  };

  await axios.post(url, data, {

    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    }

  });

}

/*
========================================
SEND TEXT
========================================
*/

async function sendText(to, text) {

  const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

  await axios.post(

    url,

    {
      messaging_product: "whatsapp",
      to: to,
      text: { body: text }
    },

    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    }

  );

}

/*
========================================
START SERVER
========================================
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log("Server running on port", PORT);

});
