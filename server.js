const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("BOT KEDAI MEDIA AKTIF");
});

app.get("/webhook", (req, res) => {
  res.send("WEBHOOK AKTIF");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("=================================");
  console.log("BOT KEDAI MEDIA AKTIF");
  console.log("PORT:", PORT);
  console.log("=================================");
});
