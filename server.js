const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("KEDAI MEDIA BOT RUNNING");
});

app.get("/health", (req, res) => {
  res.send("OK");
});

/* START SERVER */

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("================================");
  console.log("SERVER BERJALAN");
  console.log("PORT:", PORT);
  console.log("================================");
});
