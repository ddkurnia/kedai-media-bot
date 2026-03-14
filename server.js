const express = require("express");

const app = express();

/* ROUTE TEST */

app.get("/", (req, res) => {
  res.send("SERVER HIDUP");
});

/* PORT RAILWAY */

const PORT = process.env.PORT || 3000;

/* START SERVER */

app.listen(PORT, "0.0.0.0", () => {
  console.log("================================");
  console.log("SERVER RUNNING");
  console.log("PORT:", PORT);
  console.log("================================");
});
