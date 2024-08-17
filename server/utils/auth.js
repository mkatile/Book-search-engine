const jwt = require("jsonwebtoken");

// Use environment variable for secret
const secret = process.env.JWT_SECRET || "mydefaultsecret"; // Default value for local testing
const expiration = "2h";

module.exports = {
  authMiddleware: function ({ req }) {
    // Skip authentication for OPTIONS requests
    if (req.method === 'OPTIONS') {
      return { user: null };
    }

    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return { user: null };
    }

    try {
      const { data } = jwt.verify(token, secret);
      return { user: data };
    } catch (err) {
      console.log("Invalid token", err);
      return { user: null };
    }
  },
  
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
