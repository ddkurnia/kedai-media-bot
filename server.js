const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;

// root
app.get("/", (req, res) => {
  console.log("ROOT DIAKSES");
  res.status(200).send("BOT KEDAI MEDIA AKTIF");
});

// webhook GET
app.get("/webhook", (req, res) => {
  console.log("WEBHOOK GET DIAKSES");
  res.status(200).send("WEBHOOK AKTIF");
});

// webhook POST
app.post("/webhook", (req, res) => {
  console.log("WEBHOOK POST MASUK:", JSON.stringify(req.body));
  res.sendStatus(200);
});

// JALANKAN SERVER
app.listen(PORT, "0.0.0.0", () => {
  console.log("=================================");
  console.log("SERVER BERHASIL JALAN");
  console.log("PORT:", PORT);
  console.log("=================================");
});
