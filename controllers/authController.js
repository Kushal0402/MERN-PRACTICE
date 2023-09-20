const User = require("../model/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: "Username and Password are required" });
  }

  //check if user exists
  const userFound = await User.findOne({ username: user });
  if (!userFound)
    return res.status(401).json({ message: `User ${user} doesn't exist` });

  const roles = Object.values(userFound.roles).filter(Boolean);
  //Evaluate password
  const match = await bcrypt.compare(pwd, userFound.password);
  if (match) {
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
    const refreshtoken = jwt.sign(
      { username: userFound.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    userFound.refreshtoken = refreshtoken;

    const result = await userFound.save();

    console.log(result);

    res.cookie("jwt", refreshtoken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
    });
    res.json({ accesstoken, roles });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
