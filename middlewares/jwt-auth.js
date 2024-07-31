var jwt = require("jsonwebtoken");
const { findBlacklist } = require("../models/blacklist-model");

var generateJwtToken = ({ email, name, id }) => {
  var token = jwt.sign({ email, name, id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

function verifyJwtToken(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).json({
      message: "no access token",
    });
  }

  findBlacklist({ token })
    .then((data) => {
      if (data.length > 0) {
        return res.status(403).json({
          message: "token was already logged out",
        });
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: err.message,
          });
        }
        req.id = decoded.id;
        next();
      });
    })
    .catch((err) => {
      if (!res.headersSent) {
        return res.status(500).json({
          message: err ?? err?.message,
        });
      }
    });
}

module.exports = {
  generateJwtToken,
  verifyJwtToken,
};
