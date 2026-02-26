const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

/*
====================================
KONFIGURASI
====================================
*/

const TOKEN = "EAARwNbUXAHgBQwNTfbkIKmXLBYYj0CJjCbEUhCBbO0dhoGpvnMuq0NUUmxof5dtlhRSsscbtWdaYAPbC9wZCg2jGzTlfIzCIi9yNzehCb25H1pHZCVQp58dXUdDzmsoT3TWSbn4M9r7RhJXpKN0Q9GfZAgKI9amUmGMPnGEVMEOpmZCawGlApilrnKGfDQ7NpT3GSBwK6QOzKZCRw6Qqby9STzYr5szFr5T6vH9CQHp21HgdW57xLzZATgZCbAmVQuZApozXWIZBRZAmKlS1C0uSL6s8CpDfo7VuKw6TcZD";

const PHONE_ID = "952598557943860";

const VERIFY_TOKEN = "kedaimedia";


/*
====================================
KIRIM MENU UTAMA (BUTTON)
====================================
*/

async function kirimMenuUtama(nomor) {

  await axios.post(
    `https://graph.facebook.com/v22.0/${PHONE_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: nomor,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text:
            "Selamat datang di Kedai Media\n\nSolusi Profesional IT & Media Sosial\n\nSilakan pilih:"
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "lihat_layanan",
                title: "📋 Lihat Layanan"
              }
            },
            {
              type: "reply",
              reply: {
                id: "hubungi_admin",
                title: "👨‍💼 Hubungi Admin"
              }
            },
            {
              type: "reply",
              reply: {
                id: "website",
                title: "🌐 Website Kedai Media"
              }
            }
          ]
        }
      }
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

}


/*
====================================
KIRIM LIST LAYANAN
====================================
*/

async function kirimListLayanan(nomor) {

  await axios.post(
    `https://graph.facebook.com/v22.0/${PHONE_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: nomor,
      type: "interactive",
      interactive: {
        type: "list",
        body: {
          text: "Daftar layanan Kedai Media:"
        },
        action: {
          button: "Pilih Layanan",
          sections: [
            {
              title: "Layanan Utama",
              rows: [
                {
                  id: "wa_bot",
                  title: "WhatsApp Automation",
                  description: "Mulai Rp350.000"
                },
                {
                  id: "followers",
                  title: "Tambah Followers",
                  description: "Mulai Rp85.000"
                },
                {
                  id: "engagement",
                  title: "Engagement Sosial Media",
                  description: "Like, Komentar, View"
                },
                {
                  id: "website",
                  title: "Pembuatan Website",
                  description: "Mulai Rp500.000"
                },
                {
                  id: "recovery",
                  title: "Pemulihan Akun",
                  description: "Mulai Rp250.000"
                }
              ]
            }
          ]
        }
      }
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

}


/*
====================================
KIRIM LINK ADMIN
====================================
*/

async function kirimAdmin(nomor) {

  await axios.post(
    `https://graph.facebook.com/v22.0/${PHONE_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: nomor,
      text: {
        body:
          "Klik link berikut untuk chat langsung dengan admin:\n\nhttps://wa.me/6282285781863"
      }
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

}


/*
====================================
KIRIM LINK WEBSITE
====================================
*/

async function kirimWebsite(nomor) {

  await axios.post(
    `https://graph.facebook.com/v22.0/${PHONE_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: nomor,
      text: {
        body:
          "Kunjungi website Kedai Media:\n\nhttps://ddkurnia.github.io/kedai-media/"
      }
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

}


/*
====================================
WEBHOOK VERIFY
====================================
*/

app.get("/webhook", (req, res) => {

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }

});


/*
====================================
WEBHOOK RECEIVE MESSAGE
====================================
*/

app.post("/webhook", async (req, res) => {

  try {

    const msg =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!msg) return res.sendStatus(200);

    const nomor = msg.from;

    // tombol diklik
    if (msg.type === "interactive") {

      const id =
        msg.interactive?.button_reply?.id ||
        msg.interactive?.list_reply?.id;

      if (id === "lihat_layanan")
        await kirimListLayanan(nomor);

      else if (id === "hubungi_admin")
        await kirimAdmin(nomor);

      else if (id === "website")
        await kirimWebsite(nomor);

      else
        await kirimMenuUtama(nomor);

    }

    else {

      await kirimMenuUtama(nomor);

    }

    res.sendStatus(200);

  }

  catch (err) {

    console.log(err.response?.data || err.message);
    res.sendStatus(500);

  }

});


/*
====================================
START SERVER
====================================
*/

app.listen(3000, () => {

  console.log("Kedai Media Bot Aktif");

});
