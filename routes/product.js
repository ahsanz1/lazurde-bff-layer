const express = require("express");
const { default: axios } = require("axios");
const { apiConfig, HEADERS } = require("../config");
const ENDPOINTS = require("../endpoints");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const { sku, region } = req.body;

  if (!sku || !region)
    return res
      .status(400)
      .send({ hasError: true, message: "Invalid request body." });

  try {
    const headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${apiConfig[region]?.BC_GRAPHQL_API_TOKEN}`,
    };
    const graphqlQuery = {
      query: ` query productById(
          $sku: String
        ) {
          site {
            product(sku: $sku) {
              id
              entityId
              name
              sku
              plainTextDescription
              description
              defaultImage {
                ...ImageFields
              }
              images {
                edges {
                  node {
                    ...ImageFields
                  }
                }
              }
              inventory {
                isInStock
                hasVariantInventory
                aggregated {
                  availableToSell
                  warningLevel
                }
              }
              categories {
                edges{
                  node {
                    id
                    entityId
                    name
                    path
                  }
                }
              }
              customFields {
                edges {
                  node {
                    entityId
                    name
                    value
                  }
                }
              }
              metafields(namespace: "product Attributes") {
                edges {
                  node {
                    entityId
                    id
                    key
                    value
                  }
                } 
              }
              variants {
                edges {node {
                  id
                  sku
                  entityId
                  options {
                    edges {
                      node {
                        entityId
                        displayName
                        values {
                          edges {
                            node {
                              entityId
                              label
                            }
                          }
                        }
                      }
                    }
                  }
                  inventory {
                    isInStock
                    aggregated {
                      availableToSell
                      warningLevel
                    }
                  }
                  productOptions {
                    edges{
                      node{
                        entityId
                        displayName
                        isRequired
                        isVariantOption
                      }
                    }
                  }
                }}
              }
              reviewSummary {
                summationOfRatings
                numberOfReviews
              }
              prices (includeTax: true) {
                price {
                  ...MoneyFields
                }
                salePrice{
                  ...MoneyFields
                }
                basePrice{
                  ...MoneyFields
                }
              }
              brand {
                name
              }
            }
          }
        }
        
        fragment ImageFields on Image {
          url320wide: url(width: 320)
          url640wide: url(width: 640)
          url960wide: url(width: 960)
          url1280wide: url(width: 1280)
          url1440wide: url(width: 1440)
          altText
        }
        
        fragment MoneyFields on Money {
          value
          currencyCode
        }`,
      variables: { sku: sku },
    };

    const response = await axios({
      url: apiConfig[region]?.BC_GRAPHQL_API_DOMAIN,
      method: "POST",
      headers: headers,
      data: graphqlQuery,
    });

    console.log(response.data);

    if (!response?.data?.data?.site?.product)
      throw new Error("Product not found.");

    res
      .status(200)
      .send({ hasError: false, data: response?.data?.data?.site?.product });
  } catch (error) {
    next(error);
  }
});

router.post("/metafields/:id", async (req, res, next) => {
  const { id } = req.params;
  const { region } = req.body;

  if (!id || !region)
    return res
      .status(400)
      .send({ hasError: true, message: "Invalid request." });

  try {
    const response = await axios.get(
      `${
        apiConfig.bigCommerceAPIDomain
      }${ENDPOINTS.BIGCOMMERCE.PRODUCT.GET_META_FIELDS(id)}`,
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
