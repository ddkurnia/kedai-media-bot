const express = require("express");
const axios = require("axios");
const fs = require("fs");

const app = express();
app.use(express.json());

// TOKEN DAN PHONE NUMBER ID ANDA
const TOKEN = "EAARwNbUXAHgBQwNTfbkIKmXLBYYj0CJjCbEUhCBbO0dhoGpvnMuq0NUUmxof5dtlhRSsscbtWdaYAPbC9wZCg2jGzTlfIzCIi9yNzehCb25H1pHZCVQp58dXUdDzmsoT3TWSbn4M9r7RhJXpKN0Q9GfZAgKI9amUmGMPnGEVMEOpmZCawGlApilrnKGfDQ7NpT3GSBwK6QOzKZCRw6Qqby9STzYr5szFr5T6vH9CQHp21HgdW57xLzZATgZCbAmVQuZApozXWIZBRZAmKlS1C0uSL6s8CpDfo7VuKw6TcZD";

const PHONE_NUMBER_ID = "952598557943860";

// database user
const DB_FILE = "users.json";

// load database
function loadUsers() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE));
  } catch {
    return [];
  }
}

// save database
function saveUsers(users) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users));
}

// menu utama Kedai Media
function mainMenu() {
  return `Halo, selamat datang di Kedai Media.

Kami menyediakan layanan profesional IT & Media Sosial untuk bisnis, perusahaan, dan instansi pemerintah.

Pilih layanan:

1. Pembuatan Website Profesional
2. Desain Grafis & Branding
3. WhatsApp Automation & Chatbot
4. Followers & Engagement Media Sosial
5. Pemulihan Akun Media Sosial
6. Keamanan & Penghapusan Akun
7. Konsultasi IT & Media Sosial

Balas dengan nomor layanan yang Anda butuhkan.`;
}

// balasan layanan
function getReply(text) {

  switch(text) {

    case "1":
      return "Kedai Media menyediakan pembuatan website profesional untuk bisnis dan instansi pemerintah.";

    case "2":
      return "Kami menyediakan layanan desain grafis profesional untuk kebutuhan branding dan promosi.";

    case "3":
      return "Kami menyediakan WhatsApp Automation dan Chatbot untuk bisnis dan instansi pemerintah.";

    case "4":
      return "Kami menyediakan layanan peningkatan followers dan engagement media sosial.";

    case "5":
      return "Kami membantu pemulihan akun media sosial yang terkunci atau diretas.";

    case "6":
      return "Kami menyediakan layanan keamanan dan penghapusan akun media sosial.";

    case "7":
    case "konsultasi":
      return "Silakan kirimkan kebutuhan Anda. Tim Kedai Media siap membantu Anda.";

    default:
      return null;
  }

}

// webhook receive message
app.post("/webhook", async (req, res) => {

  try {

    const message =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text = message.text?.body?.toLowerCase() || "";

    let users = loadUsers();

    let reply = getReply(text);

    // jika user baru → kirim menu
    if (!users.includes(from)) {

      users.push(from);
      saveUsers(users);

      reply = mainMenu();

    }

    // kirim balasan jika ada
    if (reply) {

      await axios.post(
        `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          text: { body: reply }
        },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      );

    }

  } catch (error) {
    console.log(error.response?.data || error.message);
  }

  res.sendStatus(200);

});

// webhook verification
app.get("/webhook", (req, res) => {

  const VERIFY_TOKEN = "kedaimedia_verify";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }

});

// start server
app.listen(3000, () => {
  console.log("Kedai Media WhatsApp Bot Aktif di port 3000");
});
