const express = require("express");
const product = require("./routes/product");
const cart = require("./routes/cart");
const promotions = require("./routes/promotions");
const errorHandler = require("./middleware/error");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/product", product);
app.use("/api/cart", cart);
app.use("/api/promotions", promotions);

app.use(errorHandler);

module.exports = app;
