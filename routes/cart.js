const express = require("express");
const { default: axios } = require("axios");
const { apiConfig, HEADERS } = require("../config");
const ENDPOINTS = require("../endpoints");
const router = express.Router();

router.get("/:cartId", async (req, res) => {
  const { cartId = "" } = req.params;
  const { region = "" } = req.body;

  try {
    const response = await axios.get(
      `${apiConfig[region].BC_API_DOMAIN}${ENDPOINTS.BIGCOMMERCE.CART.GET_CART(
        cartId
      )}`,
      {
        headers: {
          ...HEADERS.bcRestApis,
          "X-Auth-Token": apiConfig[region].BC_X_AUTH_TOKEN,
        },
      }
    );

    res.status(200).send({
      hasError: false,
      data: response?.data?.data,
    });
  } catch (error) {
    console.log(error);
    const parsedErr = JSON.parse(JSON.stringify(error)) || {};
    console.log("BFF > Error fetching cart: ", parsedErr);
    return res
      .status(parsedErr?.status || 400)
      .send({ hasError: true, message: parsedErr?.message || error?.message });
  }
});

router.post("/create-cart", async (req, res) => {
  const { region = "", payload = null } = req.body;

  if (!payload || !region)
    return res
      .status(400)
      .send({ hasError: true, message: "Invalid request." });

  try {
    const response = await axios.post(
      `${apiConfig[region].BC_API_DOMAIN}${ENDPOINTS.BIGCOMMERCE.CART.CREATE_CART}`,
      { ...payload, channel_id: apiConfig.bigCommerceChannelId },
      {
        headers: {
          ...HEADERS.bcRestApis,
          "X-Auth-Token": apiConfig[region].BC_X_AUTH_TOKEN,
        },
      }
    );

    res.status(200).send({
      hasError: false,
      data: response?.data?.data,
    });
  } catch (error) {
    const parsedErr = JSON.parse(JSON.stringify(error)) || {};
    console.log("BFF > Error creating cart: ", parsedErr);
    return res
      .status(parsedErr?.status || 400)
      .send({ hasError: true, message: parsedErr?.message || error?.message });
  }
});

router.post("/add-product", async (req, res) => {
  const { region = "", cartId = "", payload = null } = req.body;

  if (!cartId || !payload || !region)
    return res
      .status(400)
      .send({ hasError: true, message: "Invalid request." });

  try {
    const response = await axios.post(
      `${apiConfig[region].BC_API_DOMAIN}${ENDPOINTS.CART.ADD_ITEM_TO_CART(
        cartId
      )}`,
      { ...payload, channel_id: apiConfig.bigCommerceChannelId },
      {
        headers: {
          ...HEADERS.bcRestApis,
          "X-Auth-Token": apiConfig[region].BC_X_AUTH_TOKEN,
        },
      }
    );

    res.status(200).send({
      hasError: false,
      data: response?.data,
    });
  } catch (error) {
    const parsedErr = JSON.parse(JSON.stringify(error)) || {};
    console.log("BFF > Error adding product to cart: ", parsedErr);
    return res
      .status(parsedErr?.status || 400)
      .send({ hasError: true, message: parsedErr?.message || error?.message });
  }
});

router.put("/update-cart/:cartId/product/:itemId", async (req, res) => {
  const { cartId = "", itemId = "" } = req.params;
  const { region = "", payload = null } = req.body;

  try {
    const response = await axios.put(
      `${
        apiConfig[region].BC_API_DOMAIN
      }${ENDPOINTS.BIGCOMMERCE.CART.UPDATE_ITEM_IN_CART(cartId, itemId)}`,
      { ...payload, channel_id: apiConfig.bigCommerceChannelId },
      {
        headers: {
          ...HEADERS.bcRestApis,
          "X-Auth-Token": apiConfig[region].BC_X_AUTH_TOKEN,
        },
      }
    );

    res.status(200).send({
      hasError: false,
      data: response?.data?.data,
    });
  } catch (error) {
    const parsedErr = JSON.parse(JSON.stringify(error)) || {};
    console.log("BFF > Error updating product in cart: ", parsedErr);
    return res
      .status(parsedErr?.status || 400)
      .send({ hasError: true, message: parsedErr?.message || error?.message });
  }
});

router.put("/update-cart/:cartId/customer/:customerId", async (req, res) => {
  const { cartId = "", customerId = "" } = req.params;
  const { region = "" } = req.body;

  if (!cartId || !customerId || !region)
    return res
      .status(400)
      .send({ hasError: true, message: "Invalid request." });

  try {
    const response = await axios.put(
      `${apiConfig[region].BC_API_DOMAIN}${ENDPOINTS.BIGCOMMERCE.CART.GET_CART(
        cartId
      )}`,
      { customer_id: customerId },
      {
        headers: {
          ...HEADERS.bcRestApis,
          "X-Auth-Token": apiConfig[region].BC_X_AUTH_TOKEN,
        },
      }
    );

    res.status(200).send({
      hasError: false,
      data: response?.data?.data,
    });
  } catch (error) {
    const parsedErr = JSON.parse(JSON.stringify(error)) || {};
    console.log("BFF > Error updating customer in cart: ", parsedErr);
    return res
      .status(parsedErr?.status || 400)
      .send({ hasError: true, message: parsedErr?.message || error?.message });
  }
});

router.delete("/delete-cart/:cartId", async (req, res) => {
  const { cartId = "" } = req.params;
  const { region = "" } = req.body;

  if (!cartId || !region)
    return res
      .status(400)
      .send({ hasError: true, message: "Invalid request." });

  try {
    const response = await axios.delete(
      `${
        apiConfig[region].BC_API_DOMAIN
      }${ENDPOINTS.BIGCOMMERCE.CART.DELETE_CART(cartId)}`,
      {
        headers: {
          ...HEADERS.bcRestApis,
          "X-Auth-Token": apiConfig[region].BC_X_AUTH_TOKEN,
        },
      }
    );

    res.status(200).send({
      hasError: false,
      data: response?.data,
    });
  } catch (error) {
    const parsedErr = JSON.parse(JSON.stringify(error)) || {};
    console.log("BFF > Error deleting cart: ", parsedErr);
    return res
      .status(parsedErr?.status || 400)
      .send({ hasError: true, message: parsedErr?.message });
  }
});

router.delete("/delete-product/:cartId/:itemId", async (req, res) => {
  const { cartId = "", itemId = "" } = req.params;
  const { region = "" } = req.body;

  if (!cartId || !itemId || !region)
    return res
      .status(400)
      .send({ hasError: true, message: "Invalid request." });

  try {
    const response = await axios.delete(
      `${
        apiConfig[region].BC_API_DOMAIN
      }${ENDPOINTS.BIGCOMMERCE.CART.REMOVE_ITEM_FROM_CART(cartId, itemId)}`,
      {
        headers: {
          ...HEADERS.bcRestApis,
          "X-Auth-Token": apiConfig[region].BC_X_AUTH_TOKEN,
        },
      }
    );

    res.status(200).send({
      hasError: false,
      data: response?.data?.data,
    });
  } catch (error) {
    const parsedErr = JSON.parse(JSON.stringify(error)) || {};
    console.log("BFF > Error deleting product from cart: ", parsedErr);
    return res
      .status(parsedErr?.status || 400)
      .send({ hasError: true, message: parsedErr?.message || error?.message });
  }
});

module.exports = router;
