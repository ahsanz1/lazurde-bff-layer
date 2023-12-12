const express = require("express");
const { default: axios } = require("axios");
const { apiConfig, HEADERS } = require("../config");
const ENDPOINTS = require("../endpoints");
const { getCustomerDetailQuery } = require("../lib/gql-queries");
const router = express.Router();


//getCustomerByEmail & getCustomerById
router.post("/", async (req, res, next) => {
  const { email = "", id = "" } = req.query;
  const { region = "" } = req.body;

  if (!region || (!email && !id))
    return res
      .status(400)
      .send({ hasError: true, message: "Invalid request." });

  try {
    const response = await axios.get(
      `${apiConfig[region].BC_API_DOMAIN}${ENDPOINTS.BIGCOMMERCE.CUSTOMER.GET_CUSTOMER}`,
      {
        ...(email && {
          params: {
            "email:in": email,
          },
        }),
        ...(id && {
          params: {
            "id:in": id,
          },
        }),
        headers: {
          ...HEADERS.bcRestApis,
          "X-Auth-Token": apiConfig[region].BC_X_AUTH_TOKEN,
        },
      }
    );

    if (response.data?.data?.length === 0)
      throw new Error("Customer not found.");

    res.status(200).send({
      hasError: false,
      data: response.data?.data,
    });
  } catch (error) {
    next(error);
  }
});

//getACustomerDetail
router.post("/detail/:customerId", async (req, res, next) => {
  const { customerId = "" } = req.params;
  const { region = "" } = req.body;

  if (!region || !customerId)
    return res
      .status(400)
      .send({ hasError: true, message: "Invalid request." });

  try {
    const headers = {
      "content-type": "application/json",
      "x-bc-customer-id": customerId,
      Authorization: `Bearer ${apiConfig[region].BC_GRAPHQL_CI_TOKEN}`,
    };

    const response = await axios({
      url: apiConfig[region].BC_GRAPHQL_API_DOMAIN,
      method: "POST",
      headers: headers,
      data: getCustomerDetailQuery,
    });
    res
      .status(200)
      .send({ hasError: false, data: response?.data?.data?.customer });
  } catch (error) {
    next(error);
  }
});

//getAllCustomerAttributes
router.post("/attributes", async (req, res, next) => {
  const { region = "" } = req.body;

  if (!region)
    return res
      .status(400)
      .send({ hasError: true, message: "Invalid request." });

  try {
    const allAttrRes = await axios.get(
      `${apiConfig[region].BC_API_DOMAIN}${ENDPOINTS.BIGCOMMERCE.CUSTOMER.CUSTOMER_ATTRIBUTES}`,
      {
        headers: {
          ...HEADERS.bcRestApis,
          "X-Auth-Token": apiConfig[region].BC_X_AUTH_TOKEN,
        },
      }
    );
    res.status(200).send({ hasError: false, data: allAttrRes?.data?.data });
  } catch (error) {
    next(error);
  }
});

//getAttributesByCustomerId
router.post("/:customerId/attributes", async (req, res, next) => {
  const { customerId = "" } = req.params;
  const { region = "" } = req.body;

  if (!region || !customerId)
    return res
      .status(400)
      .send({ hasError: true, message: "Invalid request." });

  try {
    const response = await axios.get(
      `${
        apiConfig[region].BC_API_DOMAIN
      }${ENDPOINTS.BIGCOMMERCE.CUSTOMER.ATTRIBUTES_BY_CUSTOMER_ID(customerId)}`,
      {
        headers: {
          ...HEADERS.bcRestApis,
          "X-Auth-Token": apiConfig[region].BC_X_AUTH_TOKEN,
        },
      }
    );
    if (response.data?.data?.length === 0)
      throw new Error("No attributes found for the provided customer id.");
    res.status(200).send({
      hasError: false,
      data: response.data?.data,
    });
  } catch (error) {
    next(error);
  }
});

//createCustomerApi
router.post("/create", async (req, res, next) => {
  const { payload = null, region = "" } = req.body;

  if (!region || !payload)
    return res
      .status(400)
      .send({ hasError: true, message: "Invalid request." });

  try {
    const response = await axios.post(
      `${apiConfig[region].BC_API_DOMAIN}${ENDPOINTS.BIGCOMMERCE.CUSTOMER.CREATE_CUSTOMER}`,
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
      data: response.data?.data,
    });
  } catch (error) {
    next(error);
  }
});

//sendKlaviyoEmail
router.post("/email", async (req, res, next) => {
  const { payload = null } = req.body;

  if (!payload)
    return res
      .status(400)
      .send({ hasError: true, message: "Invalid request." });

  try {
    const klaviyoEmailRes = await axios.post(
      `${apiConfig.klaviyoAPIdomain}${ENDPOINTS.KLAVIYO.EVENTS}`,
      payload,
      {
        headers: {
          Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
          revision: apiConfig.klaviyoAPIrevision,
        },
      }
    );
    return klaviyoEmailRes.status;
  } catch (error) {
    next(error);
  }
});

//updateCustomerApi
router.put("/update", async (req, res, next) => {
  const { payload = null, region = "" } = req.body;

  if (!region || !payload)
    return res
      .status(400)
      .send({ hasError: true, message: "Invalid request." });

  try {
    const response = await axios.put(
      `${apiConfig[region].BC_API_DOMAIN}${ENDPOINTS.BIGCOMMERCE.CUSTOMER.CREATE_CUSTOMER}`,
      payload,
      {
        headers: {
          ...HEADERS.bcRestApis,
          "X-Auth-Token": apiConfig[region].BC_X_AUTH_TOKEN,
        },
      }
    );

    if (response.data?.data?.length === 0)
      throw new Error("Customer does not exist.");

    res.status(200).send({
      hasError: false,
      data: response.data?.data,
    });
  } catch (error) {
    next(error);
  }
});

//updateCustomerAttributesApi
router.put("/update/attributes", async (req, res, next) => {
  const { payload = null, region = "" } = req.body;
  try {
    const response = await axios.put(
      `${apiConfig[region].BC_API_DOMAIN}${ENDPOINTS.BIGCOMMERCE.CUSTOMER.UPDATE_ATTRIBUTE_VALUES}`,
      payload,
      {
        headers: {
          ...HEADERS.bcRestApis,
          "X-Auth-Token": apiConfig[region].BC_X_AUTH_TOKEN,
        },
      }
    );

    if (response.data?.data?.length === 0)
      throw new Error("Could not update customer attribute.");

    res.status(200).send({
      hasError: false,
      data: response.data?.data,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
