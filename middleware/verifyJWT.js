const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeaders = req.headers['Authorization'] || req.headers['authorization'];
  if (!authHeaders?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeaders.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // Invalid Token
    req.user = decoded.userinfo.username;
    req.roles = decoded.userinfo.roles;
    next();
  });
}; 

module.exports = verifyJWT;
