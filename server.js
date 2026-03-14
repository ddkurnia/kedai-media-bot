const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const ADMIN_NUMBER = process.env.ADMIN_NUMBER;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const users = {};

app.get("/", (req, res) => {
  res.send("KEDAI MEDIA BOT ONLINE");
});

/*
=========================
VERIFY WEBHOOK META
=========================
*/

app.get("/webhook", (req, res) => {

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {

    console.log("Webhook Verified");
    res.status(200).send(challenge);

  } else {

    res.sendStatus(403);

  }

});

/*
=========================
TERIMA PESAN WHATSAPP
=========================
*/

app.post("/webhook", async (req, res) => {

  console.log("Webhook Event:", JSON.stringify(req.body));

  try {

    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const messages = value?.messages;

    if (messages && messages[0]) {

      const msg = messages[0];
      const from = msg.from;

      if (msg.type === "text") {

        const text = msg.text.body;

        if (!users[from]) {

          users[from] = true;

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
=========================
WELCOME MESSAGE
=========================
*/

async function kirimWelcome(to) {

const text =
`Selamat datang di Kedai Media 👋

Kami menyediakan layanan:

• Recovery Akun Facebook / IG / TikTok
• WhatsApp Automation
• Pembuatan Website
• Social Media Management
• Followers & Engagement
• Custom Automation System

Silakan jelaskan kebutuhan Anda.`;

await kirimText(to, text);

}

/*
=========================
GEMINI AI RESPONSE
=========================
*/

async function balasAI(to, pesanUser) {

try {

const prompt =

`Kamu adalah sales profesional Kedai Media.

Layanan Kedai Media:

1. Recovery akun Facebook / Instagram / TikTok
2. WhatsApp Automation
3. Website Development
4. Social Media Management
5. Followers & Engagement
6. Automation System
7. Custom Bot

Jawab dengan ramah, singkat, profesional.

Customer berkata:
${pesanUser}`;

const response = await axios.post(

`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,

{
contents:[
{
parts:[
{text:prompt}
]
}
]
}

);

const jawaban =
response.data.candidates[0].content.parts[0].text;

await kirimText(to, jawaban);

} catch (err) {

console.log("ERROR GEMINI:", err.message);

}

}

/*
=========================
KIRIM WHATSAPP MESSAGE
=========================
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
=========================
NOTIFIKASI ADMIN
=========================
*/

async function kirimNotifikasiAdmin(nomor, pesan) {

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
=========================
START SERVER
=========================
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {

console.log("================================");
console.log("KEDAI MEDIA BOT AKTIF");
console.log("PORT:", PORT);
console.log("================================");

});
