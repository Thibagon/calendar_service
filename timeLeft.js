const Discord = require('discord.js');
const moment = require('moment')
const log = require('./logger.js');
const conf = require('./conf.json');
const {isAdmin} = require('./utils.js');
const talked_recently = new Set();

function timeLeft(client, msg, args) {

    if (!talked_recently.has(msg.author.id)) {
        //Bot admin by pass the rules
        if (!isAdmin(msg)) {
            talked_recently.add(msg.author.id);
            if(msg.member != null){
                msg.react('⏲️')
                    .then(setTimeout(() => {
                        talked_recently.delete(msg.author.id);
                        msg.clearReactions();
                    }, 20000));
            }else{
                setTimeout(() => {
                    talked_recently.delete(msg.author.id);
                }, 20000)
            }
        }
    } else {
        if(msg.member != null){
            msg.react('⏲️')
                .then(setTimeout(() => {
                    talked_recently.delete(msg.author.id);
                    msg.clearReactions();
                }, 20000));
        }else{
            setTimeout(() => {
                talked_recently.delete(msg.author.id);
            }, 20000)
        }
        return;
    }

    let fin = moment();
    if(moment().day() == 5){
        fin.hour(16).minute(30).second(0);
    }else{
        fin.hour(17).minute(30).second(0);
    }

    let current = moment();
    let embed_result = new Discord.RichEmbed()
        .setColor('#4bb9ae')
        .setAuthor("Réponse automatique")
        .setTitle("Temps restant avant fin de journée");

    embed_result.setDescription("Fin de journée dans "+fin.from(current,true));
    msg.channel.send(embed_result);
}

module.exports = {
    timeLeft
};