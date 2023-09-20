const User = require("../model/User");

const handleLogout = async (req, res) => {
  //For frontend delete access token on client

  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }
  const refreshtoken = cookies.jwt;

  const userFound = await User.findOne({ refreshtoken: refreshtoken });
  if (!userFound) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    return res.sendStatus(204);
  }

  userFound.refreshtoken = '';
  const result = await userFound.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.sendStatus(204);
};

module.exports = { handleLogout };
