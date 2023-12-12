const apiConfig = {
  bigCommerceChannelId: process.env.BC_CHANNEL_ID,
  klaviyoAPIdomain: process.env.KLAVIYO_API_DOMAIN,
  klaviyoAPIkey: process.env.KLAVIYO_API_KEY,
  klaviyoAPIrevision: process.env.KLAVIYO_API_REVISION,
  jwtSecretKey: process.env.JWT_SECRET_KEY,

  sa: {
    BC_API_DOMAIN: process.env.BC_API_DOMAIN_SA,
    BC_STORE_HASH: process.env.BC_KSA_STORE_HASH,
    BC_X_AUTH_TOKEN: process.env.BC_KSA_X_AUTH_TOKEN,
    BC_GRAPHQL_API_DOMAIN: process.env.BC_GRAPHQL_API_DOMAIN_SA,
    BC_GRAPHQL_API_TOKEN: process.env.BC_GRAPHQL_API_TOKEN_SA,
    BC_GRAPHQL_CI_TOKEN: process.env.BC_GRAPHQL_CI_TOKEN_SA,
  },
};

const HEADERS = {
  bcRestApis: {
    "Content-Type": "application/json",
  },
};

module.exports = { apiConfig, HEADERS };
