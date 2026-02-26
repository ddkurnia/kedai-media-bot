const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

/*
================================
CONFIG
================================
*/

const VERIFY_TOKEN = "kedaimedia";

const WHATSAPP_TOKEN = "EAARwNbUXAHgBQwNTfbkIKmXLBYYj0CJjCbEUhCBbO0dhoGpvnMuq0NUUmxof5dtlhRSsscbtWdaYAPbC9wZCg2jGzTlfIzCIi9yNzehCb25H1pHZCVQp58dXUdDzmsoT3TWSbn4M9r7RhJXpKN0Q9GfZAgKI9amUmGMPnGEVMEOpmZCawGlApilrnKGfDQ7NpT3GSBwK6QOzKZCRw6Qqby9STzYr5szFr5T6vH9CQHp21HgdW57xLzZATgZCbAmVQuZApozXWIZBRZAmKlS1C0uSL6s8CpDfo7VuKw6TcZD";

const PHONE_NUMBER_ID = "952598557943860";


/*
================================
ROOT
================================
*/

app.get("/", (req, res) => {
  res.status(200).send("Kedai Media Bot Aktif");
});


/*
================================
WEBHOOK VERIFY
================================
*/

app.get("/webhook", (req, res) => {

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});


/*
================================
WEBHOOK RECEIVE
================================
*/

app.post("/webhook", async (req, res) => {

  try {

    console.log("Webhook received");

    const body = req.body;

    if (body.object) {

      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const messages = value?.messages;

      if (messages && messages[0]) {

        const from = messages[0].from;
        const text = messages[0].text?.body?.toLowerCase() || "";

        console.log("Message from:", from);
        console.log("Text:", text);

        await handleMessage(from, text);

      }

      res.sendStatus(200);

    } else {
      res.sendStatus(404);
    }

  } catch (err) {

    console.log("ERROR WEBHOOK:", err.message);
    res.sendStatus(200);

  }

});


/*
================================
HANDLE MESSAGE
================================
*/

async function handleMessage(from, text) {

  if (text === "halo" || text === "hi" || text === "menu") {
    return sendMenu(from);
  }

  if (text === "1") {
    return sendText(from,
`Pembuatan Website

Landing Page: Rp300.000
Website Bisnis: Rp500.000
Website Premium: Rp1.000.000

Ketik MENU untuk kembali`);
  }

  if (text === "2") {
    return sendText(from,
`WhatsApp Automation

Basic: Rp300.000
Pro: Rp500.000
Instansi/Pemerintah: Rp1.000.000

Ketik MENU untuk kembali`);
  }

  if (text === "9") {
    return sendText(from,
`Hubungi Admin:
https://wa.me/6282285781863`);
  }

  if (text === "10") {
    return sendText(from,
`Website:
https://ddkurnia.github.io/kedai-media/`);
  }

  return sendMenu(from);
}


/*
================================
SEND MENU
================================
*/

async function sendMenu(to) {

  return axios.post(
    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: {
        body:
`Kedai Media

1. Website
2. WhatsApp Automation
9. Hubungi Admin
10. Website

Ketik angka`
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


/*
================================
SEND TEXT
================================
*/

async function sendText(to, message) {

  return axios.post(
    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: {
        body: message
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


/*
================================
START SERVER
================================
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Kedai Media Bot Aktif di port " + PORT);
});
