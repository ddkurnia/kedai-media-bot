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

const ADMIN_NUMBER = "6282285781863";

/*
===========================
OPENAI INIT (AMAN ENV)
===========================
*/

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
WEBHOOK PESAN MASUK
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

        if (
          text.includes("menu") ||
          text.includes("layanan") ||
          text.includes("halo") ||
          text.includes("hi")
        ) {

          await kirimMenuUtama(from);

        }
        else {

          await balasAI(from, msg.text.body);

          await kirimNotifikasiAdmin(from, msg.text.body);

        }

      }

      /*
      ===========================
      TOMBOL
      ===========================
      */

      if (msg.type === "interactive") {

        const id =
          msg.interactive.button_reply.id;

        if (id === "admin") {

          await kirimText(
            from,
            "Silakan hubungi admin:\nhttps://wa.me/" +
            ADMIN_NUMBER
          );

        }

      }

    }

    res.sendStatus(200);

  }
  catch (err) {

    console.log("ERROR WEBHOOK:", err.message);

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

    const response =
      await openai.chat.completions.create({

        model: "gpt-4o-mini",

        messages: [

          {
            role: "system",
            content: `
Kamu adalah Sales dan Customer Service Kedai Media.

Tujuan utama kamu adalah:

• memahami kebutuhan customer
• membantu customer
• menawarkan layanan Kedai Media
• mengarahkan customer menjadi client

Layanan:

1 WhatsApp Automation
2 Website
3 Social Media Service
4 Recovery Akun
5 Developer & IT

Gaya bicara:

• profesional
• ramah
• singkat
• natural seperti manusia

Selalu arahkan ke closing.

Akhiri dengan ajakan konsultasi atau hubungi admin.
`
          },

          {
            role: "user",
            content: pesanUser
          }

        ],

        temperature: 0.7,
        max_tokens: 300

      });

    const jawaban =
      response.choices[0].message.content;

    await kirimText(to, jawaban);

  }
  catch (err) {

    console.log("ERROR AI:", err.message);

    await kirimText(
      to,
      "Terima kasih, tim kami siap membantu. Silakan jelaskan kebutuhan Anda."
    );

  }

}

/*
===========================
MENU
===========================
*/

async function kirimMenuUtama(to) {

  await kirimText(
    to,
`Selamat datang di Kedai Media 👋

Kami menyediakan:

• WhatsApp Automation
• Pembuatan Website
• Social Media Service
• Recovery Akun
• Developer & IT

Silakan jelaskan kebutuhan Anda.`
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
===========================
NOTIFIKASI ADMIN
===========================
*/

async function kirimNotifikasiAdmin(user, pesan) {

  await kirimText(
    ADMIN_NUMBER,
`LEAD BARU

Nomor:
${user}

Pesan:
${pesan}`
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
  console.log("KEDAI MEDIA SALES AI PRO AKTIF");
  console.log("PORT:", PORT);
  console.log("=================================");

});
