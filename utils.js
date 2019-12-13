const adminRoles = ["bot_commander","Admin","Délégués"];

function isAdmin(msg){
    return msg.member.roles.some(r => adminRoles.includes(r.name))
}
module.exports = {
    isAdmin
};