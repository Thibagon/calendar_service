const conf = require("./conf.json");
const adminRoles = conf.admins;

function isAdmin(msg){
    return msg.member.roles.some(r => adminRoles.includes(r.name))
}
module.exports = {
    isAdmin
};