const fs = require('fs');

var logger = fs.createWriteStream('log.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
})

function writeLog(str){
    logger.write("\n"+str);
}

module.exports = {
    writeLog
};