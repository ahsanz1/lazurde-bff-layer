const express = require("express");
const { default: axios } = require("axios");
const { apiConfig, HEADERS } = require("../config");
const ENDPOINTS = require("../endpoints");
const { getProductQuery } = require("../lib/gql-queries");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const { sku = "", region = "" } = req.body;

  if (!sku || !region)
    return res
      .status(400)
      .send({ hasError: true, message: "Invalid request body." });

  try {
    const headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${apiConfig[region]?.BC_GRAPHQL_API_TOKEN}`,
    };

    const response = await axios({
      url: apiConfig[region]?.BC_GRAPHQL_API_DOMAIN,
      method: "POST",
      headers: headers,
      data: { ...getProductQuery, variables: { sku: sku } },
    });

    if (!response?.data?.data?.site?.product)
      throw new Error("Product not found.");

    res
      .status(200)
      .send({ hasError: false, data: response?.data?.data?.site?.product });
  } catch (error) {
    next(error);
  }
});

router.post("/metafields/:productId", async (req, res, next) => {
  const { productId = "" } = req.params;
  const { region = "" } = req.body;

  if (!id || !region)
    return res
      .status(400)
      .send({ hasError: true, message: "Invalid request." });

  try {
    const response = await axios.get(
      `${
        apiConfig[region].BC_API_DOMAIN
      }${ENDPOINTS.BIGCOMMERCE.PRODUCT.GET_META_FIELDS(productId)}`,
      {
        headers: {
          ...HEADERS.bcRestApis,
          "X-Auth-Token": apiConfig[region].BC_X_AUTH_TOKEN,
        },
      }
    );
    res.status(200).send({ hasError: false, data: response?.data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
