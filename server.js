const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

/*
===========================
KONFIGURASI WAJIB
===========================
*/

const VERIFY_TOKEN = "kedaimedia123";

const ACCESS_TOKEN = "EAARwNbUXAHgBQ5EDstEvgD9wkGMypGSTGElLVGWmfO7cZBmozfZAjknNdVosqLLGMS89z9qPnjhDsf966nNBA2LhSXTqR6dZCRE4HJ6vzs8s2ggLeSado9B1ZB723nwZCGdP8eD3i7VMfIrcOLupgx9e260C9dUDTRZChm1yHpklpSLg8X94d0cYELYR7OSyWGzrEYECvqT6R9SIXf6ZBsZCT3SWrRopNdkdfZAYnTnZBCTtb19GBZBvGYJGmCtni0oZBahOtErxEIahjX6ZBZC4gAV2BFBNHUf7NMwraQzREZD";

const PHONE_NUMBER_ID = "989399234262931";


/*
===========================
ROOT TEST
===========================
*/

app.get("/", (req, res) => {
  res.send("Kedai Media WhatsApp Bot Aktif");
});


/*
===========================
WEBHOOK VERIFY
===========================
*/

app.get("/webhook", (req, res) => {

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {

    console.log("Webhook verified");
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
    const messages = value?.messages;

    if (messages) {

      const from = messages[0].from;
      const text = messages[0].text?.body || "";

      console.log("Pesan masuk:", text);


      let reply = "";

      if (
        text.toLowerCase().includes("halo") ||
        text.toLowerCase().includes("hai") ||
        text.toLowerCase().includes("menu")
      ) {

        reply =
`Halo! Selamat datang di Kedai Media 🚀

Silakan pilih layanan:

1. Jasa Website
2. Desain Grafis
3. Bot WhatsApp
4. Kelola Sosial Media
5. Landing Page
6. Toko Online
7. SEO Website
8. Maintenance Website
9. Hubungi Admin
10. Kunjungi Website

Ketik nomor pilihan Anda`;

      }

      else if (text === "1") {

        reply =
`Jasa Website

Harga mulai Rp500.000

Termasuk:
• Desain modern
• Mobile friendly
• Hosting support

Minat? Balas: Ya`;

      }

      else if (text === "2") {

        reply =
`Desain Grafis

Logo: Rp100.000
Poster: Rp50.000
Banner: Rp50.000`;

      }

      else if (text === "3") {

        reply =
`Bot WhatsApp

Harga Rp300.000

Fitur:
• Auto reply
• Menu otomatis
• Hosting support`;

      }

      else if (text === "9") {

        reply =
`Hubungi Admin:
https://wa.me/6282285781863`;

      }

      else if (text === "10") {

        reply =
`Website Kedai Media:
https://ddkurnia.github.io/kedai-media/`;

      }

      else {

        reply =
`Ketik "menu" untuk melihat layanan Kedai Media`;

      }


      await kirimPesan(from, reply);

    }

    res.sendStatus(200);

  }

  catch (error) {

    console.log("ERROR:", error.response?.data || error.message);
    res.sendStatus(200);

  }

});


/*
===========================
FUNCTION KIRIM PESAN
===========================
*/

async function kirimPesan(to, text) {

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
===========================
JALANKAN SERVER
===========================
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {

  console.log("=================================");
  console.log("KEDAI MEDIA BOT AKTIF");
  console.log("PORT:", PORT);
  console.log("=================================");

});
