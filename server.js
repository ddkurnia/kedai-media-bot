const express = require("express");
const axios = require("axios");
const OpenAI = require("openai");

const app = express();
app.use(express.json());

/*
===========================
KONFIGURASI UTAMA
===========================
*/

const VERIFY_TOKEN = "kedaimedia123";

const ACCESS_TOKEN = "GANTI_DENGAN_ACCESS_TOKEN_KAMU";

const PHONE_NUMBER_ID = "989399234262931";

/* nomor admin */
const ADMIN_NUMBER = "6282285781863";

/* OpenAI dari Railway ENV (AMAN) */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


/*
===========================
ROOT TEST
===========================
*/

app.get("/", (req, res) => {
  res.send("BOT KEDAI MEDIA SALES AI PRO AKTIF");
});


/*
===========================
VERIFY WEBHOOK
===========================
*/

app.get("/webhook", (req, res) => {

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {

    console.log("WEBHOOK VERIFIED");
    res.status(200).send(challenge);

  } else {

    res.sendStatus(403);

  }

});


/*
===========================
TERIMA PESAN MASUK
===========================
*/

app.post("/webhook", async (req, res) => {

  try {

    const body = req.body;

    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages
    ) {

      const msg =
        body.entry[0].changes[0].value.messages[0];

      const from = msg.from;


      /*
      ===========================
      PESAN TEXT
      ===========================
      */

      if (msg.type === "text") {

        const text =
          msg.text.body.toLowerCase();

        console.log("Pesan masuk:", text);

        /* trigger menu */
        if (
          text.includes("menu") ||
          text.includes("layanan") ||
          text === "hi" ||
          text === "halo"
        ) {

          await kirimMenuUtama(from);

        }

        else {

          /* SALES AI PRO */
          await balasAI(from, msg.text.body);

        }

      }


      /*
      ===========================
      TOMBOL DIKLIK
      ===========================
      */

      if (msg.type === "interactive") {

        const id =
          msg.interactive.button_reply.id;


        if (id === "wa") {

          await kirimText(from,
`🤖 WhatsApp Automation

UMKM : Rp300.000
Bisnis : Rp800.000 – Rp1.500.000
Instansi Pemerintah : Rp2.000.000+

Cocok untuk otomatisasi bisnis dan instansi.`);

          await kirimNotifikasiAdmin(from, "WhatsApp Automation");

        }


        if (id === "website") {

          await kirimText(from,
`🌐 Pembuatan Website

Landing Page : Rp500.000
Website Bisnis : Rp800.000+
Company Profile : Rp1.500.000+

Mobile friendly & profesional.`);

          await kirimNotifikasiAdmin(from, "Website");

        }


        if (id === "sosmed") {

          await kirimText(from,
`📈 Social Media Service

Followers, Likes, Views, Komentar tersedia.

Instagram, TikTok, Facebook.`);

          await kirimNotifikasiAdmin(from, "Social Media");

        }


        if (id === "recovery") {

          await kirimText(from,
`🔐 Recovery Akun

Facebook, Instagram, TikTok.

Proses aman dan profesional.`);

          await kirimNotifikasiAdmin(from, "Recovery");

        }


        if (id === "developer") {

          await kirimText(from,
`💻 Developer & IT

Bot, Automation, API Integration.`);

          await kirimNotifikasiAdmin(from, "Developer");

        }


        if (id === "admin") {

          await kirimText(from,
`📞 Hubungi Admin:

https://wa.me/${ADMIN_NUMBER}`);

        }

      }

    }

    res.sendStatus(200);

  }
  catch (error) {

    console.log("ERROR:",
      error.response?.data ||
      error.message
    );

    res.sendStatus(200);

  }

});


/*
===========================
SALES AI PRO
===========================
*/

async function balasAI(to, pesanUser) {

  try {

    console.log("AI proses:", pesanUser);

    const response =
      await openai.chat.completions.create({

        model: "gpt-4o-mini",

        messages: [

          {
            role: "system",
            content:
`Kamu adalah sales profesional Kedai Media.

Tugas kamu:

• jawab ramah
• jawab profesional
• pahami kebutuhan customer
• arahkan ke closing
• tawarkan layanan yang relevan

Layanan Kedai Media:

• Website
• WhatsApp Automation
• Social Media Service
• Recovery akun
• Developer & IT

Selalu arahkan customer untuk lanjut konsultasi atau order.`
          },

          {
            role: "user",
            content: pesanUser
          }

        ],

        temperature: 0.7

      });


    const jawaban =
      response.choices[0].message.content;

    await kirimText(to, jawaban);

    await kirimNotifikasiAdmin(to, "AI Conversation");


  }
  catch (err) {

    console.log("ERROR AI:", err.message);

  }

}


/*
===========================
MENU UTAMA
===========================
*/

async function kirimMenuUtama(to) {

  await kirimText(to,
`Selamat datang di Kedai Media 👋

Kami menyediakan layanan:

• WhatsApp Automation
• Pembuatan Website
• Social Media Service
• Recovery Akun
• Developer & IT

Silakan pilih layanan atau tanyakan kebutuhan Anda.`);

}


/*
===========================
KIRIM TEXT
===========================
*/

async function kirimText(to, text) {

  await axios.post(

    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,

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
===========================
NOTIFIKASI ADMIN
===========================
*/

async function kirimNotifikasiAdmin(userNumber, layanan) {

  await axios.post(

    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,

    {
      messaging_product: "whatsapp",
      to: ADMIN_NUMBER,
      text: {
        body:
`🔔 LEAD BARU

Nomor: ${userNumber}

Aktivitas: ${layanan}`
      }
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
===========================
START SERVER
===========================
*/

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {

  console.log("=================================");
  console.log("BOT KEDAI MEDIA SALES AI PRO AKTIF");
  console.log("PORT:", PORT);
  console.log("=================================");

});
