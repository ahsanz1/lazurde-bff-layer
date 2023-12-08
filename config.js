const apiConfig = {
  bigCommerceChannelId: process.env.BC_CHANNEL_ID,
  sa: {
    BC_API_DOMAIN: process.env.BC_API_DOMAIN_SA,
    BC_STORE_HASH: process.env.BC_KSA_STORE_HASH,
    BC_X_AUTH_TOKEN: process.env.BC_KSA_X_AUTH_TOKEN,
    BC_GRAPHQL_API_DOMAIN: process.env.BC_GRAPHQL_API_DOMAIN_SA,
    BC_GRAPHQL_API_TOKEN: process.env.BC_GRAPHQL_API_TOKEN_SA,
  },
};

const HEADERS = {
  bcRestApis: {
    "Content-Type": "application/json",
  },
};

module.exports = { apiConfig, HEADERS };
