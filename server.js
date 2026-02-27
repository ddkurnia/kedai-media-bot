const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

/*
===========================
KONFIG
===========================
*/

const VERIFY_TOKEN = "kedaimedia123";

const ACCESS_TOKEN =
"EAARwNbUXAHgBQ4V11stRBbVZCZC3SF8ESOM9VyB6dijvXRJefgZBQuqlUF7ZAVHbqxA5H62r9ZBPT3yhwaZBCSLTGU0ZAuw4BZBkQZBvD8WInv08rAGH9PKTSX3qSYOQZCvBwyAHbLBHZAWjd46FPpfuXmwYrG8YR3tmYB9E8Nnky3J8sDX4e8fsbYY0g8JeBs272WlgsliPQbf9q7zf5zZB7p80ZCeHBEKAqRmi55OubKsrrV5HcH2OlSAZA7SaS33LcZBMkaINOuPq0AiEpfUwpGpDijTtAoamIzVluKHOtoZD";

const PHONE_NUMBER_ID = "989399234262931";


/*
===========================
ROOT
===========================
*/

app.get("/", (req, res) => {

  res.status(200).send("BOT KEDAI MEDIA AKTIF");

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

  if (mode === "subscribe" && token === VERIFY_TOKEN) {

    console.log("WEBHOOK VERIFIED");

    res.status(200).send(challenge);

  } else {

    res.sendStatus(403);

  }

});


/*
===========================
TERIMA PESAN
===========================
*/

app.post("/webhook", async (req, res) => {

  try {

    const entry = req.body.entry?.[0];

    const changes = entry?.changes?.[0];

    const value = changes?.value;

    const msg = value?.messages?.[0];

    if (!msg) {

      return res.sendStatus(200);

    }

    const from = msg.from;

    /*
    TEXT
    */

    if (msg.type === "text") {

      const text = msg.text.body.toLowerCase();

      if (
        text === "menu" ||
        text === "halo" ||
        text === "hi"
      ) {

        await kirimMenu(from);

      } else {

        await kirimText(
          from,
          "Ketik *menu* untuk melihat layanan 🚀"
        );

      }

    }


    /*
    BUTTON
    */

    if (msg.type === "interactive") {

      const id =
        msg.interactive.button_reply.id;

      if (id === "website") {

        await kirimText(
          from,
          "🌐 Jasa Website\nHarga mulai Rp500.000"
        );

      }

      if (id === "desain") {

        await kirimText(
          from,
          "🎨 Desain Grafis\nMulai Rp50.000"
        );

      }

      if (id === "botwa") {

        await kirimText(
          from,
          "🤖 Bot WhatsApp\nHarga Rp300.000"
        );

      }

    }

    res.sendStatus(200);

  } catch (err) {

    console.log(
      "ERROR:",
      err.response?.data || err.message
    );

    res.sendStatus(200);

  }

});


/*
===========================
MENU BUTTON
===========================
*/

async function kirimMenu(to) {

  await axios.post(

    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,

    {

      messaging_product: "whatsapp",

      to,

      type: "interactive",

      interactive: {

        type: "button",

        body: {

          text:
"Selamat datang di Kedai Media 🚀\nPilih layanan:"

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
            }

          ]

        }

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
KIRIM TEXT
===========================
*/

async function kirimText(to, text) {

  await axios.post(

    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,

    {

      messaging_product: "whatsapp",

      to,

      text: {

        body: text

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
START SERVER (WAJIB RAILWAY)
===========================
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {

  console.log("BOT AKTIF DI PORT", PORT);

});
