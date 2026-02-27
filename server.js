const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("BOT KEDAI MEDIA AKTIF");
});

app.get("/webhook", (req, res) => {
  res.status(200).send("WEBHOOK AKTIF");
});

const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log("SERVER JALAN DI PORT:", PORT);
});
