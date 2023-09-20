const User = require("../model/User");

const jwt = require("jsonwebtoken");
const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  const refreshtoken = cookies.jwt;

  const userFound = await User.findOne({ refreshtoken }).exec();
  if (!userFound) return res.sendStatus(403);

  const roles = Object.values(userFound.roles);

  jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || userFound.username !== decoded.username)
      return res.sendStatus(403);
    const accesstoken = jwt.sign(
      {
        userinfo: {
          username: userFound.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accesstoken });
  });
};

module.exports = { handleRefreshToken };
