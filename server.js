const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

/*
====================
KONFIG
====================
*/

const VERIFY_TOKEN = "kedaimedia123";

const ACCESS_TOKEN = "EAARwNbUXAHgBQ5EDstEvgD9wkGMypGSTGElLVGWmfO7cZBmozfZAjknNdVosqLLGMS89z9qPnjhDsf966nNBA2LhSXTqR6dZCRE4HJ6vzs8s2ggLeSado9B1ZB723nwZCGdP8eD3i7VMfIrcOLupgx9e260C9dUDTRZChm1yHpklpSLg8X94d0cYELYR7OSyWGzrEYECvqT6R9SIXf6ZBsZCT3SWrRopNdkdfZAYnTnZBCTtb19GBZBvGYJGmCtni0oZBahOtErxEIahjX6ZBZC4gAV2BFBNHUf7NMwraQzREZD";

const PHONE_NUMBER_ID = "989399234262931";


/*
====================
ROOT TEST (WAJIB)
====================
*/

app.get("/", (req, res) => {
  res.status(200).send("BOT AKTIF");
});


/*
====================
WEBHOOK VERIFY
====================
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
====================
TERIMA PESAN
====================
*/

app.post("/webhook", async (req, res) => {

  try {

    const body = req.body;

    if (
      body.object &&
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages
    ) {

      const msg = body.entry[0].changes[0].value.messages[0];

      const from = msg.from;
      const text = msg.text?.body || "";

      console.log("PESAN MASUK:", text);

      let reply = "";

      if (text.toLowerCase() === "menu" || text.toLowerCase() === "halo") {

        reply =
`Halo! Kedai Media 🚀

1 Website
2 Desain Grafis
3 Bot WhatsApp
9 Admin
10 Website

Ketik nomor`;

      }

      else if (text === "1") {

        reply = "Website mulai Rp500.000";

      }

      else if (text === "2") {

        reply = "Desain mulai Rp50.000";

      }

      else if (text === "3") {

        reply = "Bot WhatsApp Rp300.000";

      }

      else if (text === "9") {

        reply = "Admin: https://wa.me/6282285781863";

      }

      else if (text === "10") {

        reply = "Website: https://ddkurnia.github.io/kedai-media/";

      }

      else {

        reply = "Ketik menu";

      }

      await axios.post(
        `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          text: { body: reply }
        },
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      );

    }

    res.sendStatus(200);

  } catch (e) {

    console.log("ERROR:", e.message);
    res.sendStatus(200);

  }

});


/*
====================
START SERVER
====================
*/

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {

  console.log("BOT RUNNING ON PORT", PORT);

});
