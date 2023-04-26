const { format } = require('date-fns');
const { v4:uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (msg) => {
    const dateTime = `${format(new Date(), 'yyyy/MM/dd\tHH:mm:ss')}`;
    const logItem = `\n${dateTime}\t${uuid()}\t${msg}`;
    console.log(logItem);
    try {
        if (!fs.existsSync(path.join(__dirname, 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, 'logs')); 
        }
        await fsPromises.appendFile(path.join(__dirname, 'logs', 'log.txt'), logItem);
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = logEvents;