const fs = require('fs');
const conf = require('./auth.json');

var logger = fs.createWriteStream(conf.logPath+'log.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
})

function writeLog(str){
    logger.write("\n"+str);
}

module.exports = {
    writeLog
};