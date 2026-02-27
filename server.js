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

const ACCESS_TOKEN = "EAARwNbUXAHgBQ5PUIXS8Jsf2haucV7BG0qlksmrLrd78JhgGY0pXWxXGiPdZBCmdUtAcwoBJB4MWwjN0j0AE4qncU5Iwr9mPOrJZCBoRA2NUy7nootGX15ZCAXasZCMPDkNlcQtkPkehcz5oDcdS0571ff3ODXsJBBj3PAImd15boGTZA88WzF4Q7SBe7AMQ4eo92sp2ZAzAJnwMr5JZBmE5kautSFLfWQYmROXDSIB";

const PHONE_NUMBER_ID = "989399234262931";

const ADMIN_NUMBER = "6282285781863";

/* OPENAI dari Railway environment variable */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


/*
===========================
ROOT TEST
===========================
*/

app.get("/", (req, res) => {
  res.send("BOT KEDAI MEDIA AI AKTIF");
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
      PESAN TEXT → AI ATAU MENU
      ===========================
      */

      if (msg.type === "text") {

        const userText = msg.text.body.toLowerCase();

        if (
          userText === "menu" ||
          userText === "halo" ||
          userText === "hi"
        ) {

          await kirimMenuUtama(from);

        } else {

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

Klik Hubungi Admin untuk konsultasi.`);

          await kirimNotifikasiAdmin(from, "WhatsApp Automation");

        }


        if (id === "website") {

          await kirimText(from,
`🌐 Pembuatan Website

Landing Page : Rp500.000
Website Bisnis : Rp800.000+
Company Profile : Rp1.500.000+

Klik Hubungi Admin untuk konsultasi.`);

          await kirimNotifikasiAdmin(from, "Website");

        }


        if (id === "sosmed") {

          await kirimText(from,
`📈 Social Media Service

Followers Instagram 1000 : Rp25.000+
Followers TikTok 1000 : Rp20.000+

Klik Hubungi Admin untuk order.`);

          await kirimNotifikasiAdmin(from, "Social Media");

        }


        if (id === "recovery") {

          await kirimText(from,
`🔐 Recovery Akun Sosial Media

Facebook : Rp100.000+
Instagram : Rp100.000+

Klik Hubungi Admin untuk bantuan.`);

          await kirimNotifikasiAdmin(from, "Recovery");

        }


        if (id === "developer") {

          await kirimText(from,
`💻 Developer & IT Service

Bot custom : Rp300.000+
Automation : Rp500.000+

Klik Hubungi Admin untuk konsultasi.`);

          await kirimNotifikasiAdmin(from, "Developer");

        }


        if (id === "admin") {

          await kirimText(from,
`📞 Hubungi Admin Kedai Media

https://wa.me/6282285781863`);

        }

      }

    }

    res.sendStatus(200);

  } catch (error) {

    console.log(
      "ERROR:",
      error.response?.data ||
      error.message
    );

    res.sendStatus(200);

  }

});


/*
===========================
AI RESPONSE
===========================
*/

async function balasAI(to, pesanUser) {

  try {

    const response =
      await openai.chat.completions.create({

        model: "gpt-4o-mini",

        messages: [

          {
            role: "system",
            content:
"Kamu adalah customer service Kedai Media. Jawab profesional, singkat, jelas. Jika user tanya harga atau layanan, jawab sesuai layanan Kedai Media dan arahkan hubungi admin: https://wa.me/6282285781863"
          },

          {
            role: "user",
            content: pesanUser
          }

        ]

      });


    const jawaban =
      response.choices[0].message.content;

    await kirimText(to, jawaban);

  } catch (err) {

    console.log("ERROR AI:", err.message);

  }

}


/*
===========================
MENU UTAMA
===========================
*/

async function kirimMenuUtama(to) {

  await kirimText(
    to,
`Selamat datang di Kedai Media 👋

Silakan pilih layanan:

• WhatsApp Automation
• Pembuatan Website
• Social Media
• Recovery Akun
• Developer & IT

Atau tanyakan langsung kebutuhan Anda.`
  );

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

      text: {
        body: text
      }

    },

    {

      headers: {

        Authorization:
          `Bearer ${ACCESS_TOKEN}`,

        "Content-Type":
          "application/json"

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

  await kirimText(
    ADMIN_NUMBER,
`🔔 LEAD BARU

Nomor: ${userNumber}

Minat: ${layanan}`
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
  console.log("BOT KEDAI MEDIA AI AKTIF");
  console.log("PORT:", PORT);
  console.log("=================================");

});
