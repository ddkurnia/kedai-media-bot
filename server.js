const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

/*
====================================
KONFIGURASI UTAMA
====================================
*/

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const ADMIN_NUMBER = process.env.ADMIN_NUMBER;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/*
====================================
DATABASE MEMORY USER (ANTI LOOP)
====================================
*/

const users = {};

/*
====================================
ROOT TEST
====================================
*/

app.get("/", (req, res) => {
  res.send("KEDAI MEDIA SALES AI PRO AKTIF");
});

/*
====================================
VERIFY WEBHOOK
====================================
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
====================================
TERIMA PESAN MASUK
====================================
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

      if (msg.type === "text") {

        const text = msg.text.body;

        if (!users[from]) {

          users[from] = {
            welcomeSent: true,
            notified: false,
          };

          await kirimWelcome(from);

          await kirimNotifikasiAdmin(
            from,
            "Client baru menghubungi bot"
          );

        }

        await balasAI(from, text);

      }

    }

    res.sendStatus(200);

  } catch (err) {

    console.log("ERROR WEBHOOK:", err.message);

    res.sendStatus(200);

  }

});

/*
====================================
WELCOME MESSAGE
====================================
*/

async function kirimWelcome(to) {

  const text =

`Selamat datang di Kedai Media 👋

Kami menyediakan layanan profesional:

• WhatsApp Automation
• Pembuatan Website
• Social Media Management
• Followers, Likes, Engagement
• Recovery Akun Sosial Media
• Developer & IT Automation

Silakan jelaskan kebutuhan Anda, kami siap membantu.`;

  await kirimText(to, text);

}

/*
====================================
GEMINI AI RESPONSE
====================================
*/

async function balasAI(to, pesanUser) {

  try {

    const prompt =

`Kamu adalah Sales Profesional Kedai Media.

Tugas kamu:

- jawab chat customer
- pahami kebutuhan customer
- arahkan ke layanan Kedai Media
- gunakan bahasa ramah dan profesional
- fokus closing
- jangan terlalu panjang
- arahkan customer untuk lanjut konsultasi admin jika serius

Layanan Kedai Media:

1. WhatsApp Automation
2. Website Development
3. Social Media Management
4. Followers & Engagement
5. Recovery Account
6. Automation System
7. Custom Bot

Pertanyaan customer:
${pesanUser}`;

    const response = await axios.post(

      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,

      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      }

    );

    const jawaban =
      response.data.candidates[0]
      .content.parts[0].text;

    await kirimText(to, jawaban);

  } catch (err) {

    console.log("ERROR GEMINI:", err.message);

  }

}

/*
====================================
KIRIM TEXT KE WHATSAPP
====================================
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
        Authorization:
          `Bearer ${ACCESS_TOKEN}`,
        "Content-Type":
          "application/json"
      }
    }

  );

}

/*
====================================
NOTIFIKASI ADMIN
====================================
*/

async function kirimNotifikasiAdmin(
  nomor,
  pesan
) {

  await kirimText(

    ADMIN_NUMBER,

`Lead Baru Kedai Media

Nomor:
${nomor}

Pesan:
${pesan}`

  );

}

/*
====================================
START SERVER
====================================
*/

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {

  console.log("================================");
  console.log("KEDAI MEDIA SALES AI PRO AKTIF");
  console.log("PORT:", PORT);
  console.log("================================");

});
