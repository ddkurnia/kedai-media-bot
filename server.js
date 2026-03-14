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

/* ROOT */
app.get("/", (req, res) => {
  res.status(200).send("KEDAI MEDIA BOT RUNNING");
});

/* HEALTH CHECK */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/* VERIFY WEBHOOK */
app.get("/webhook", (req, res) => {

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);

});

/* TERIMA PESAN */
app.post("/webhook", async (req, res) => {

  res.sendStatus(200);

  try {

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages) return;

    const msg = messages[0];
    const from = msg.from;

    if (msg.type !== "text") return;

    const text = msg.text.body;

    console.log("Message:", text);

    if (!users[from]) {

      users[from] = { step: "menu" };

      await sendMenu(from);
      await notifyAdmin(from);

      return;

    }

    await replyAI(from, text);

  } catch (err) {

    console.log("ERROR:", err.message);

  }

});

/* MENU */
async function sendMenu(to) {

const text =
`Halo 👋

Selamat datang di Kedai Media.

Layanan kami:

1. WhatsApp Automation
2. Pembuatan Website
3. Social Media Management
4. Followers & Engagement
5. Recovery Akun
6. Custom Bot

Silakan tulis kebutuhan Anda.`;

await sendMessage(to, text);

}

/* AI */
async function replyAI(to, userText) {

try {

const prompt = `Kamu CS Kedai Media. Jawab ramah dan bantu closing.

Pertanyaan:
${userText}`;

const response = await axios.post(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
{
contents:[{parts:[{text:prompt}]}]
}
);

const reply =
response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
"Silakan jelaskan kebutuhan Anda.";

await sendMessage(to, reply);

} catch (err) {

console.log("Gemini error:", err.message);

await sendMessage(to,"Maaf sistem sedang sibuk.");

}

}

/* KIRIM WA */
async function sendMessage(to,text){

try{

await axios.post(
`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
{
messaging_product:"whatsapp",
to:to,
text:{body:text}
},
{
headers:{
Authorization:`Bearer ${ACCESS_TOKEN}`,
"Content-Type":"application/json"
}
}
);

}catch(err){

console.log("WA error:",err.response?.data||err.message);

}

}

/* NOTIF ADMIN */
async function notifyAdmin(nomor){

await sendMessage(
ADMIN_NUMBER,
`Lead baru masuk\n${nomor}`
);

}

/* SERVER */
const PORT = process.env.PORT;

app.listen(PORT, () => {

console.log("Server running on port", PORT);

});
