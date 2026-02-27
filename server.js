const express = require("express");

const app = express();

// ROOT TEST
app.get("/", (req, res) => {
  res.send("BOT KEDAI MEDIA AKTIF");
});

// WEBHOOK TEST
app.get("/webhook", (req, res) => {
  res.send("WEBHOOK AKTIF");
});

// PAKSA PORT 3000
const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("=================================");
  console.log("BOT KEDAI MEDIA AKTIF");
  console.log("PORT:", PORT);
  console.log("=================================");
});
