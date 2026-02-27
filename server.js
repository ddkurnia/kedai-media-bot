const express = require("express");

const app = express();

// ROOT
app.get("/", (req, res) => {
  res.status(200).send("BOT KEDAI MEDIA AKTIF");
});

// WEBHOOK
app.get("/webhook", (req, res) => {
  res.status(200).send("WEBHOOK AKTIF");
});

// PORT FINAL FIX
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("=================================");
  console.log("SERVER HIDUP");
  console.log("PORT:", PORT);
  console.log("=================================");
});
