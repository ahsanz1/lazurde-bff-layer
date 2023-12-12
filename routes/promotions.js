const express = require("express");
const { default: axios } = require("axios");
const { apiConfig, HEADERS } = require("../config");
const ENDPOINTS = require("../endpoints");
const router = express.Router();

router.post("/create-promotion", async (req, res, next) => {
  const { region = "", payload = null } = req.body;

  if (!payload || !region)
    return res
      .status(400)
      .send({ hasError: true, message: "Invalid request." });

  try {
    const response = await axios.post(
      `${apiConfig[region].BC_API_DOMAIN}${ENDPOINTS.BIGCOMMERCE.PROMOTIONS.CREATE_PROMOTION}`,
      payload,
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

router.post("/create-coupon/:promotionId", async (req, res, next) => {
  const { promotionId = "" } = req.params;
  const { region = "", payload = null } = req.body;

  if (!payload || !region || !promotionId)
    return res
      .status(400)
      .send({ hasError: true, message: "Invalid request." });
  try {
    const response = await axios.post(
      `${
        apiConfig[region].BC_API_DOMAIN
      }${ENDPOINTS.BIGCOMMERCE.PROMOTIONS.CREATE_COUPON(promotionId)}`,
      payload,
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
