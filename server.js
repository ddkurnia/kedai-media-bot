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
ROOT TEST
================================
*/

app.get("/", (req, res) => {
  res.send("Kedai Media Bot Aktif");
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

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});


/*
================================
WEBHOOK RECEIVE MESSAGE
================================
*/

app.post("/webhook", async (req, res) => {

  try {

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) {

      const from = message.from;
      const text = message.text?.body?.toLowerCase() || "";

      if (
        text === "halo" ||
        text === "menu" ||
        text === "hi"
      ) {
        await sendMenu(from);
      }

      else if (text === "1") {
        await sendText(from,
`Pembuatan Website

Landing Page: Rp300.000
Website Bisnis: Rp500.000
Website Premium: Rp1.000.000

Termasuk:
• Hosting gratis 1 bulan
• Mobile friendly
• SEO ready

Ketik MENU untuk kembali`);
      }

      else if (text === "2") {
        await sendText(from,
`WhatsApp Automation

Basic: Rp300.000
Pro: Rp500.000
Instansi/Pemerintah: Rp1.000.000

Fitur:
• Auto reply
• Menu otomatis
• Integrasi API

Ketik MENU untuk kembali`);
      }

      else if (text === "3") {
        await sendText(from,
`Tambah Followers

Instagram 1000: Rp50.000
TikTok 1000: Rp40.000
YouTube 1000: Rp100.000

Real & aman

Ketik MENU untuk kembali`);
      }

      else if (text === "9") {
        await sendText(from,
`Hubungi Admin

https://wa.me/6282285781863`);
      }

      else if (text === "10") {
        await sendText(from,
`Website Kedai Media

https://ddkurnia.github.io/kedai-media/`);
      }

      else {
        await sendMenu(from);
      }

    }

    res.sendStatus(200);

  } catch (err) {

    console.log(err);
    res.sendStatus(200);

  }

});


/*
================================
SEND MENU
================================
*/

async function sendMenu(to) {

  await axios.post(
    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: {
        body:
`Kedai Media

Silakan pilih layanan:

1. Pembuatan Website
2. WhatsApp Automation
3. Tambah Followers
4. Tambah Like
5. Pemulihan Akun
6. Keamanan Akun
7. Hapus Akun
8. Jasa IT Custom
9. Hubungi Admin
10. Website

Ketik angka menu`
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

  await axios.post(
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
  console.log("Server running on port " + PORT);
});
