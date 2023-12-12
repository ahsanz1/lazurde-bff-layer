const express = require("express");
const { default: axios } = require("axios");
const { apiConfig, HEADERS } = require("../config");
const ENDPOINTS = require("../endpoints");
const router = express.Router();

router.get("/:cartId", async (req, res, next) => {
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
    next(error);
  }
});

router.post("/create-cart", async (req, res, next) => {
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
    next(error);
  }
});

router.post("/add-product", async (req, res, next) => {
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
    next(error);
  }
});

router.put("/update-cart/:cartId/product/:itemId", async (req, res, next) => {
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
    next(error);
  }
});

router.put(
  "/update-cart/:cartId/customer/:customerId",
  async (req, res, next) => {
    const { cartId = "", customerId = "" } = req.params;
    const { region = "" } = req.body;

    if (!cartId || !customerId || !region)
      return res
        .status(400)
        .send({ hasError: true, message: "Invalid request." });

    try {
      const response = await axios.put(
        `${
          apiConfig[region].BC_API_DOMAIN
        }${ENDPOINTS.BIGCOMMERCE.CART.GET_CART(cartId)}`,
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
      next(error);
    }
  }
);

router.delete("/delete-cart/:cartId", async (req, res, next) => {
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
    next(error);
  }
});

router.delete("/delete-product/:cartId/:itemId", async (req, res, next) => {
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
    next(error);
  }
});

module.exports = router;
