const express = require("express");

const app = express();

const PORT = process.env.PORT || 8080;

// root test
app.get("/", (req, res) => {
  res.send("BOT KEDAI MEDIA AKTIF");
});

// webhook test
app.get("/webhook", (req, res) => {
  res.send("WEBHOOK AKTIF");
});

// WAJIB: listen pakai 0.0.0.0
app.listen(PORT, "0.0.0.0", () => {
  console.log("=================================");
  console.log("BOT KEDAI MEDIA AKTIF");
  console.log("PORT:", PORT);
  console.log("=================================");
});
