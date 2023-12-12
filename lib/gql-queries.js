const getProductQuery = {
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
};

const getCustomerDetailQuery = {
  query: `query Customer {
        customer {
          entityId
          company
          customerGroupId
          email
          firstName
          lastName
          notes
          phone
          taxExemptCategory
          addressCount
          attributeCount
          wishlists {
            edges {
              node {
                name
                entityId
                items {
                  edges {
                    node {
                      entityId
                      productEntityId
                      product {
                        id
                        entityId
                        name
                        sku
                        plainTextDescription
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
                        customFields {
                          edges {
                            node {
                              entityId
                              name
                              value
                            }
                          }
                        }
                        variants {
                          edges {
                            node {
                            id
                            sku
                            entityId
                            inventory {
                              isInStock
                              aggregated {
                                availableToSell
                                warningLevel
                              }
                            }
                            options {
                              edges {
                                node {
                                  entityId
                                  displayName
                                }
                              }
                            }
                          }
                        }
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
                }
              }
            }
          }
        }
      }
      fragment ImageFields on Image {
        url320wide: url(width: 320)
        url640wide: url(width: 640)
        url960wide: url(width: 960)
        url1280wide: url(width: 1280)
        altText
      }
      fragment MoneyFields on Money {
        value
        currencyCode
      }`,
};

module.exports = { getProductQuery, getCustomerDetailQuery };
