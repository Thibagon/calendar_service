const Discord = require('discord.js');
const fetch = require('node-fetch')
const client = new Discord.Client();
const auth = require('./auth.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(auth.token);
const burgerEmoji = "🍔";
const burgerReact = reaction => reaction.emoji.name === burgerEmoji;

client.on('message', msg => {
    if (msg.content.startsWith("!")) {
        if(msg.content.substr(1) == "ping")
            msg.reply('pong');
        if(msg.content.substr(1)== "salle"){
            fetch('http://51.254.133.142/sample/sample.json')
            .then(res => res.json())
            .then(json => {
                for(let key in json){

                }
                return resultat
            });
        }
    }
    msg.awaitReactions(burgerReact,{time:60000}).then(collected => {
        if (collected.size > 0)
            msg.reply("")
    });
});