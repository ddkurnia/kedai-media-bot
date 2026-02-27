const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

/*
===========================
KONFIGURASI
===========================
*/

const VERIFY_TOKEN = "kedaimedia123";

const ACCESS_TOKEN = "EAARwNbUXAHgBQ1JUzT8krlgwZAz4i6taKh7sSs86DVmf1gxqopM21Gw03s5dSuu4ysqCQQyk1ZA5n9Yw23ZCObQbJb4Y7Nxnp4tT4umJzyCUFP9iXIemfSBVisKK4cGPTuuJFzuOdZAEmZCz2JJ8XCZBO9Ldbsh4oCU1EEW1cqWsWJQuwCEnAQh1dFsctNiUQ8ynb3NgS8amf734i14mhmOCygF3G6w7h1B9QEP3CUzpUU9zffBirwCrBHrQloqd8mzsDqbbpuEd4UkbZBs9CZBO6ZATs2r5gJRaaVusZD";

const PHONE_NUMBER_ID = "989399234262931";


/*
===========================
ROOT TEST
===========================
*/

app.get("/", (req, res) => {
  res.send("BOT KEDAI MEDIA V2 AKTIF");
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
TERIMA PESAN
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
      PESAN TEXT → MENU UTAMA
      ===========================
      */

      if (msg.type === "text") {

        await kirimMenuUtama(from);

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
Instansi : Rp2.000.000+

Cocok untuk bisnis & instansi pemerintah.`);

        }


        if (id === "website") {

          await kirimText(from,
`🌐 Pembuatan Website

Landing Page : Rp500.000
Website Bisnis : Rp800.000+
Company Profile : Rp1.500.000+`);

        }


        if (id === "sosmed") {

          await kirimText(from,
`📈 Social Media Service

Followers IG : Rp25.000 / 1000
Followers TikTok : Rp20.000 / 1000

Likes, views, komentar tersedia`);

        }


        if (id === "recovery") {

          await kirimText(from,
`🔐 Recovery Akun

Facebook : Rp100.000+
Instagram : Rp100.000+
TikTok : Rp250.000+`);

        }


        if (id === "developer") {

          await kirimText(from,
`💻 Developer & IT

Bot custom : Rp300.000+
Automation system : Rp500.000+
API integration : Rp300.000+`);

        }


        if (id === "admin") {

          await kirimText(from,
`📞 Hubungi Admin

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
MENU UTAMA
===========================
*/

async function kirimMenuUtama(to) {

  await axios.post(

    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,

    {

      messaging_product: "whatsapp",

      to: to,

      type: "interactive",

      interactive: {

        type: "button",

        body: {

          text:
`Selamat datang di Kedai Media 👋

Kami menyediakan layanan IT & Digital Profesional.

Pilih layanan:`

        },

        action: {

          buttons: [

            {
              type: "reply",
              reply: {
                id: "wa",
                title: "WA Automation"
              }
            },

            {
              type: "reply",
              reply: {
                id: "website",
                title: "Pembuatan Website"
              }
            },

            {
              type: "reply",
              reply: {
                id: "sosmed",
                title: "Social Media"
              }
            }

          ]

        }

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


  /*
  KIRIM MENU KEDUA
  */

  await axios.post(

    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,

    {

      messaging_product: "whatsapp",

      to: to,

      type: "interactive",

      interactive: {

        type: "button",

        body: {

          text:
"Menu lainnya:"

        },

        action: {

          buttons: [

            {
              type: "reply",
              reply: {
                id: "recovery",
                title: "Recovery Akun"
              }
            },

            {
              type: "reply",
              reply: {
                id: "developer",
                title: "Developer & IT"
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
START SERVER
===========================
*/

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {

  console.log("=================================");
  console.log("BOT KEDAI MEDIA V2 AKTIF");
  console.log("PORT:", PORT);
  console.log("=================================");

});
