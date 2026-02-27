const express = require("express");

const app = express();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("BOT KEDAI MEDIA AKTIF");
});

app.get("/webhook", (req, res) => {
  res.send("WEBHOOK AKTIF");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("BOT KEDAI MEDIA AKTIF di PORT", PORT);
});
