const express = require("express");
const { default: axios } = require("axios");
const { apiConfig, HEADERS } = require("../config");
const ENDPOINTS = require("../endpoints");
const { getCustomerDetailQuery } = require("../lib/gql-queries");
const {
  getStoreAttributeId,
  generateEmailVerificationToken,
  sha256Hash,
} = require("../lib/utils");
const {
  customerAttributesNames,
  EMAIL_SUCCESS_CODE,
} = require("../lib/constants");
const router = express.Router();

/**
 * getCustomerByEmail & getCustomerById
   POST /api/customer
 * const { email = "", id = "" } = req.query;
   const { region = "" } = req.body;
 */
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

/**
 * getACustomerDetail
 * POST /api/customer/detail/:customerId
 * const { customerId = "" } = req.params;
   const { region = "" } = req.body;
 */
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

/**
 * getAllCustomerAttributes
 * POST /api/customer/attributes
 * const { region = "" } = req.body;
 */
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

/**
 * getAttributesByCustomerId 
 * POST /api/customer/:customerId/attributes
 * const { customerId = "" } = req.params;
   const { region = "" } = req.body;
 */
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

/**
 * createCustomerApi
 * POST /api/customer/create
 * const { payload = null, region = "" } = req.body;
 */
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

/**
 * sendKlaviyoEmail
 * POST /api/customer/email
 * const { payload = null } = req.body;
 */
router.post("/send-email", async (req, res, next) => {
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
          Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_API_KEY}`,
          revision: apiConfig.klaviyoAPIrevision,
        },
      }
    );
    res.status(200).send({
      hasError: false,
      status: klaviyoEmailRes.status,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * sendVerificationEmail
 * POST /api/customer/verification-email
 *  const {
    region = "",
    currentDomain = "",
    customerId = "",
    email = "",
    first_name = "",
    lang = "",
  } = req.body;
 */

router.post("/verification-email", async (req, res, next) => {
  const {
    region = "",
    currentDomain = "",
    customerId = "",
    email = "",
    first_name = "",
    lang = "",
  } = req.body;

  try {
    const customerHash = sha256Hash(`${email}${Date.now().toString()}`);

    let protocol = "https";
    if (req.hostname === "localhost") protocol = "http";

    //all customer attributes on store
    const storeAttributesRes = await axios.post(
      `${protocol}://${req.hostname}:${
        process.env.PORT || 4000
      }/api/customer/attributes`,
      {
        region,
      }
    );

    const upsertVerificationOTTpayload = {
      customer_id: customerId,
      attribute_id: getStoreAttributeId(
        storeAttributesRes?.data?.data,
        customerAttributesNames?.verificationEmailOTT
      ), // the attribute id of the OTT attribute you created earlier
      value: customerHash,
    };

    const upsertVerificationOTTRes = await axios.put(
      `${protocol}://${req.hostname}:${
        process.env.PORT || 4000
      }/api/customer/update/attributes`,
      {
        payload: [upsertVerificationOTTpayload],
        region,
      }
    );

    if (upsertVerificationOTTRes.hasError)
      throw new Error("Could not update customer with OTT value");

    const emailVerificationToken = generateEmailVerificationToken(
      customerId,
      email,
      upsertVerificationOTTRes.data[0]?.attribute_value,
      region,
      first_name,
      lang
    );

    const verificationEmailPayload = {
      data: {
        type: "event",
        attributes: {
          profile: {
            $email: email,
            $first_name: first_name,
          },
          metric: {
            name: "Email Verification",
          },
          properties: {
            emailVerificationLink: `${currentDomain}/api/customer/verify?token=${emailVerificationToken}&region=${region}&lang=${lang}`,
            lang,
            region,
          },
          time: new Date().toISOString(),
          unique_id: new Date().getTime().toString(),
        },
      },
    };

    // const emailStatus = await sendKlaviyoEmail(verificationEmailPayload);

    const emailStatus = await axios.post(
      `${protocol}://${req.hostname}:${
        process.env.PORT || 4000
      }/api/customer/send-email`,
      {
        payload: verificationEmailPayload,
      }
    );

    if (
      !emailStatus?.data?.hasError &&
      emailStatus?.data?.status === EMAIL_SUCCESS_CODE
    ) {
      res.status(200).json({
        emailSent: true,
      });
    } else {
      throw new Error("Could not send password reset email!");
    }
  } catch (error) {
    next(error);
  }
});

/**
 * updateCustomerApi
 * PUT /api/customer/update
 * const { payload = null, region = "" } = req.body;
 */
router.put("/update", async (req, res, next) => {
  const { payload = null, region = "" } = req.body;
  console.log("Payload: ", payload);

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
/**
 * updateCustomerAttributesApi
 * PUT /api/customer/update/attributes
 * const { payload = null, region = "" } = req.body;
 */
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
