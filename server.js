const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const path = require("path");
const { logger } = require("./middleware/logEvents");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnection");
const PORT = process.env.port || 3500;

connectDB();

app.use(logger);

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refreshToken"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/family", require("./routes/family"));

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
