const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (msg, logName) => {
  const dateTime = `${format(new Date(), "yyyy/MM/dd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${msg}\n`;
  console.log(logItem);
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) => {
  const msg = `${req.url}\t${req.method}\t${req.headers.origin}`;
  logEvents(msg, "middlewareReqLog.txt");
  next();
};

module.exports = { logger, logEvents };
