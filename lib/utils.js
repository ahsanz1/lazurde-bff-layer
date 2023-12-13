const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sha256Hash = (text) => {
  const hash = crypto.createHash("sha256");
  hash.update(text);
  return hash.digest("hex");
};

const getStoreAttributeId = (storeAttributes, attributeName) => {
  if (!storeAttributes) return null;
  const attribute = storeAttributes?.find(
    (attribute) => attribute?.name === attributeName
  );
  return attribute?.id;
};

const generateEmailVerificationToken = (
  customerId,
  email,
  ott,
  region,
  first_name,
  lang
) => {
  try {
    const secret = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(
      {
        email,
        ott,
        id: customerId,
        region,
        first_name,
        lang,
      },
      secret,
      {
        expiresIn: "10m",
      }
    );
    return token;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateEmailVerificationToken,
  getStoreAttributeId,
  sha256Hash,
};
