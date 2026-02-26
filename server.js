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

/* TOKEN DARI META */
const WHATSAPP_TOKEN = "EAARwNbUXAHgBQwNTfbkIKmXLBYYj0CJjCbEUhCBbO0dhoGpvnMuq0NUUmxof5dtlhRSsscbtWdaYAPbC9wZCg2jGzTlfIzCIi9yNzehCb25H1pHZCVQp58dXUdDzmsoT3TWSbn4M9r7RhJXpKN0Q9GfZAgKI9amUmGMPnGEVMEOpmZCawGlApilrnKGfDQ7NpT3GSBwK6QOzKZCRw6Qqby9STzYr5szFr5T6vH9CQHp21HgdW57xLzZATgZCbAmVQuZApozXWIZBRZAmKlS1C0uSL6s8CpDfo7VuKw6TcZD";

/* PHONE NUMBER ID YANG BENAR */
const PHONE_NUMBER_ID = "989399234262931";


/*
================================
ROOT TEST
================================
*/

app.get("/", (req, res) => {
  res.status(200).send("Kedai Media Bot Aktif");
});


/*
================================
WEBHOOK VERIFY META
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
WEBHOOK RECEIVE MESSAGE
================================
*/

app.post("/webhook", async (req, res) => {

  try {

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const text = message.text?.body?.toLowerCase().trim() || "";

    console.log("Message from:", from);
    console.log("Text:", text);

    /*
    ================================
    COMMAND HANDLER
    ================================
    */

    if (text === "halo" || text === "menu" || text === "hi") {
      await sendMenu(from);
    }

    else if (text === "1") {

      await sendText(from,
`Pembuatan Website Kedai Media

Landing Page
Rp300.000

Website Bisnis
Rp500.000

Website Premium
Rp1.000.000

Termasuk:
• Domain gratis (opsional)
• Hosting 1 bulan
• Mobile friendly
• SEO ready
• Fast loading
• Support 30 hari

Ketik MENU untuk kembali`);
    }

    else if (text === "2") {

      await sendText(from,
`WhatsApp Automation Kedai Media

Basic
Rp300.000

Pro
Rp500.000

Instansi
Rp1.000.000

Fitur:
• Auto reply
• Menu otomatis
• Unlimited chat
• Integrasi API
• Support Railway hosting

Ketik MENU untuk kembali`);
    }

    else if (text === "3") {

      await sendText(from,
`Tambah Followers

Instagram
1000 followers Rp50.000

TikTok
1000 followers Rp40.000

YouTube
1000 subscribers Rp100.000

Real & aman

Ketik MENU untuk kembali`);
    }

    else if (text === "4") {

      await sendText(from,
`Tambah Like

Instagram Like
1000 like Rp25.000

TikTok Like
1000 like Rp20.000

Facebook Like
1000 like Rp30.000

Ketik MENU untuk kembali`);
    }

    else if (text === "5") {

      await sendText(from,
`Pemulihan Akun

Instagram
Rp200.000

Facebook
Rp200.000

Email
Rp150.000

Keberhasilan tinggi

Ketik MENU untuk kembali`);
    }

    else if (text === "6") {

      await sendText(from,
`Keamanan Akun

Audit keamanan Rp100.000

Proteksi lengkap Rp300.000

Ketik MENU untuk kembali`);
    }

    else if (text === "7") {

      await sendText(from,
`Hapus akun permanen

Instagram
Rp200.000

Facebook
Rp200.000

TikTok
Rp200.000

Ketik MENU untuk kembali`);
    }

    else if (text === "8") {

      await sendText(from,
`Jasa IT Custom

Bot WhatsApp
Website
API Integration
Automation

Harga sesuai kebutuhan

Ketik MENU untuk kembali`);
    }

    else if (text === "9") {

      await sendText(from,
`Hubungi Admin Kedai Media

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

    res.sendStatus(200);

  }

  catch (error) {

    console.log("Webhook Error:", error.response?.data || error.message);

    res.sendStatus(200);

  }

});


/*
================================
SEND MENU FUNCTION
================================
*/

async function sendMenu(to) {

  await sendText(to,
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

Ketik angka menu`);
}


/*
================================
SEND TEXT FUNCTION
================================
*/

async function sendText(to, message) {

  try {

    await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Reply sent");

  }

  catch (error) {

    console.log("Send Error:", error.response?.data || error.message);

  }

}


/*
================================
START SERVER
================================
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log("Bot running on port", PORT);

});
