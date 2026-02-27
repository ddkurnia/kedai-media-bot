const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

/*
===============================
CONFIG
===============================
*/

const VERIFY_TOKEN = "kedaimedia";

/* TOKEN BARU ANDA */
const WHATSAPP_TOKEN = "EAARwNbUXAHgBQ5EDstEvgD9wkGMypGSTGElLVGWmfO7cZBmozfZAjknNdVosqLLGMS89z9qPnjhDsf966nNBA2LhSXTqR6dZCRE4HJ6vzs8s2ggLeSado9B1ZB723nwZCGdP8eD3i7VMfIrcOLupgx9e260C9dUDTRZChm1yHpklpSLg8X94d0cYELYR7OSyWGzrEYECvqT6R9SIXf6ZBsZCT3SWrRopNdkdfZAYnTnZBCTtb19GBZBvGYJGmCtni0oZBahOtErxEIahjX6ZBZC4gAV2BFBNHUf7NMwraQzREZD";

/* PHONE NUMBER ID BARU */
const PHONE_NUMBER_ID = "989399234262931";

/*
===============================
ROOT TEST
===============================
*/

app.get("/", (req, res) => {
  res.send("Kedai Media WhatsApp Bot Aktif");
});

/*
===============================
WEBHOOK VERIFY
===============================
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
===============================
WEBHOOK RECEIVE MESSAGE
===============================
*/

app.post("/webhook", async (req, res) => {

  try {

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const text = message.text?.body?.toLowerCase() || "";

    console.log("Pesan masuk dari:", from);
    console.log("Isi pesan:", text);

    if (
      text === "halo" ||
      text === "hi" ||
      text === "menu"
    ) {
      await sendMenu(from);
    }

    else if (text === "1") {

      await sendText(from,
`PEMBUATAN WEBSITE

Landing Page : Rp300.000
Website Bisnis : Rp500.000
Website Premium : Rp1.000.000

Termasuk:
• Mobile friendly
• SEO Ready
• Desain modern

Ketik MENU untuk kembali`
      );

    }

    else if (text === "2") {

      await sendText(from,
`WHATSAPP AUTOMATION

Basic : Rp300.000
Pro : Rp500.000
Instansi/Pemerintah : Rp1.000.000

Fitur:
• Auto reply
• Menu otomatis
• Server cloud
• Bisa pakai AI

Ketik MENU untuk kembali`
      );

    }

    else if (text === "3") {

      await sendText(from,
`TAMBAH FOLLOWERS

Instagram 1000 : Rp50.000
TikTok 1000 : Rp40.000
YouTube 1000 : Rp100.000

Real dan aman

Ketik MENU untuk kembali`
      );

    }

    else if (text === "9") {

      await sendText(from,
`HUBUNGI ADMIN

https://wa.me/6282285781863`
      );

    }

    else if (text === "10") {

      await sendText(from,
`Website Kedai Media

https://ddkurnia.github.io/kedai-media/`
      );

    }

    else {

      await sendMenu(from);

    }

    res.sendStatus(200);

  }

  catch (error) {

    console.log("ERROR:", error.response?.data || error.message);

    res.sendStatus(200);

  }

});

/*
===============================
SEND MENU
===============================
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
`KEDAI MEDIA

Silakan pilih layanan:

1. Pembuatan Website
2. WhatsApp Automation
3. Tambah Followers
4. Tambah Like & Komentar
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
===============================
SEND TEXT
===============================
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
===============================
START SERVER
===============================
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Kedai Media Bot Aktif di port " + PORT);
});
