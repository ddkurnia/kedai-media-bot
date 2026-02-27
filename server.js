const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

/*

KONFIGURASI

*/

const VERIFY_TOKEN = "kedaimedia123";

const ACCESS_TOKEN = "EAARwNbUXAHgBQ4V11stRBbVZCZC3SF8ESOM9VyB6dijvXRJefgZBQuqlUF7ZAVHbqxA5H62r9ZBPT3yhwaZBCSLTGU0ZAuw4BZBkQZBvD8WInv08rAGH9PKTSX3qSYOQZCvBwyAHbLBHZAWjd46FPpfuXmwYrG8YR3tmYB9E8Nnky3J8sDX4e8fsbYY0g8JeBs272WlgsliPQbf9q7zf5zZB7p80ZCeHBEKAqRmi55OubKsrrV5HcH2OlSAZA7SaS33LcZBMkaINOuPq0AiEpfUwpGpDijTtAoamIzVluKHOtoZD";

const PHONE_NUMBER_ID = "989399234262931";

/*

ROOT

*/

app.get("/", (req, res) => {
res.send("BOT KEDAI MEDIA AKTIF");
});

/*

VERIFY WEBHOOK

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

TERIMA PESAN

*/

app.post("/webhook", async (req, res) => {

try {

const body = req.body;  

if (  
  body.entry &&  
  body.entry[0].changes &&  
  body.entry[0].changes[0].value.messages  
) {  

  const msg = body.entry[0].changes[0].value.messages[0];  
  const from = msg.from;  

  /*  
  ===========================  
  JIKA PESAN BIASA  
  ===========================  
  */  

  if (msg.type === "text") {  

    const text = msg.text.body.toLowerCase();  

    if (text === "halo" || text === "menu") {  

      await kirimMenu(from);  

    } else {  

      await kirimText(from, "Ketik *menu* untuk melihat layanan 🚀");  

    }  

  }  

  /*  
  ===========================  
  JIKA TOMBOL DIKLIK  
  ===========================  
  */  

  if (msg.type === "interactive") {  

    const buttonId = msg.interactive.button_reply.id;  

    if (buttonId === "website") {  

      await kirimText(from,

`🌐 Jasa Website

Harga mulai Rp500.000

• Desain modern
• Mobile friendly
• Support hosting

Minat? Balas: YA`);

}  

    if (buttonId === "desain") {  

      await kirimText(from,

`🎨 Desain Grafis

Logo: Rp100.000
Poster: Rp50.000
Banner: Rp50.000`);

}  

    if (buttonId === "botwa") {  

      await kirimText(from,

`🤖 Bot WhatsApp

Harga Rp300.000

• Auto reply
• Menu tombol
• Hosting Railway`);

}  

    if (buttonId === "admin") {  

      await kirimText(from,

📞 Hubungi Admin:   https://wa.me/6282285781863);

}  

  }  

}  

res.sendStatus(200);

} catch (error) {

console.log("ERROR:", error.response?.data || error.message);  
res.sendStatus(200);

}

});

/*

FUNCTION MENU TOMBOL

*/

async function kirimMenu(to) {

await axios.post(
https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages,
{
messaging_product: "whatsapp",
to: to,
type: "interactive",
interactive: {
type: "button",
body: {
text: "Halo 👋\nSelamat datang di Kedai Media 🚀\n\nPilih layanan:"
},
action: {
buttons: [
{
type: "reply",
reply: {
id: "website",
title: "Jasa Website"
}
},
{
type: "reply",
reply: {
id: "desain",
title: "Desain Grafis"
}
},
{
type: "reply",
reply: {
id: "botwa",
title: "Bot WhatsApp"
}
},
{
type: "reply",
reply: {
id: "admin",
title: "Hubungi Admin"
}
}
]
}
}
},
{
headers: {
Authorization: Bearer ${ACCESS_TOKEN},
"Content-Type": "application/json"
}
}
);

}

/*

FUNCTION TEXT

*/

async function kirimText(to, text) {

await axios.post(
https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages,
{
messaging_product: "whatsapp",
to: to,
text: { body: text }
},
{
headers: {
Authorization: Bearer ${ACCESS_TOKEN},
"Content-Type": "application/json"
}
}
);

}

/*

JALANKAN SERVER

*/

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {

console.log("=================================");
console.log("BOT KEDAI MEDIA AKTIF");
console.log("PORT:", PORT);
console.log("=================================");

});
