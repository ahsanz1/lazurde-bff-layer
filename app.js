const express = require("express");
const product = require("./routes/product");
const cart = require("./routes/cart");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/product", product);
app.use("/api/cart", cart);

module.exports = app;
