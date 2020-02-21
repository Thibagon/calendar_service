const Discord = require('discord.js');
const log = require('./logger.js');
const conf = require('./conf.json');
const {isAdmin} = require('./utils.js');

let orders = {};
let payer = null;

function handleMac(client, msg, args) {

    var burgers = conf.burgers;
    var boissons = conf.boissons;

    let embed_result = new Discord.RichEmbed()
        .setColor('#b93323')
        .setAuthor("Réponse automatique")
        .setTitle("Les Mecs Au Camion");

    if(args.length === 0) {
        embed_result.setDescription('__Utilisation : !mac <burger> [<boisson>] [frite]__\n'
            +'**Liste des burgers** : ' + burgers.join(', ')+'\n'
            +'**Liste des boissons** : ' + boissons.join(', ')+'\n'
        );
        msg.channel.send(embed_result);
    } else {
        if(args[0] === 'resume') {
            // Résumé de la commande
            const resume = {
                burgers: {},
                boissons: {},
                frites: 0,
            };
            for (let key in orders) {
                if (!orders.hasOwnProperty(key)) {
                    continue;
                }
                let order = orders[key];

                if (order.frite) {
                    resume.frites++;
                }
                if (order.burger && !(order.burger in resume.burgers)) {
                    resume.burgers[order.burger] = 1;
                } else if (order.burger) {
                    resume.burgers[order.burger]++;
                }
                if (order.boisson && !(order.boisson in resume.boissons)) {
                    resume.boissons[order.boisson] = 1;
                } else if (order.boisson) {
                    resume.boissons[order.boisson]++;
                }
            }
            let resultBurgers = '**Burgers** : ';
            for (let key in resume.burgers) {
                if (!resume.burgers.hasOwnProperty(key)) {
                    continue;
                }
                resultBurgers += resume.burgers[key] + ' ' + key + ', ';
            }
            resultBurgers = resultBurgers.slice(0, -2);
            let resultBoissons = '**Boissons **: ';
            for (let key in resume.boissons) {
                if (!resume.boissons.hasOwnProperty(key)) {
                    continue;
                }
                resultBoissons += resume.boissons[key] + ' ' + key + ', ';
            }
            resultBoissons = resultBoissons.slice(0, -2);
            embed_result.setDescription("- " + resultBurgers + "\n"
                + "- " + resultBoissons + "\n"
                + "- **Frites ** : " + resume.frites + "\n"
            );
            msg.channel.send(embed_result);
        } else if(args[0] === 'payer') {
            if(isAdmin(msg)){
                payer = msg.mentions.users.first();
                if(payer) {
                    msg.react('👌');
                } else {
                    msg.reply("Il faut mentionner le payeur.")
                }
            }else{
                msg.reply("tu cherches les problèmes toi ?")
            }
        } else if(args[0] === 'pay') {
            if(payer && msg.member && msg.member.user.id === payer.id) {
                if(args[1] === 'list') {
                    let missingPayments = [];
                    for (let key in orders) {
                        if (!orders.hasOwnProperty(key)) {
                            continue;
                        }
                        let order = orders[key];

                        if(!order.paid) {
                            missingPayments.push(client.users.get(key).username + ' : ' + calculatePrice(order));
                        }
                    }
                    msg.reply('Missing payments : ' + missingPayments.join(', '));
                } else {
                    let userWhoPaid = msg.mentions.users.first();
                    if(userWhoPaid) {
                        orders[userWhoPaid.id].paid = true;
                        msg.react('👌');
                    } else {
                        msg.reply("Il faut mentionner le payeur.")
                    }
                }
            } else {
                msg.reply('Il faut être le payeur pour accepter un paiement ou afficher la liste.')
            }
        } else if(args[0] === 'reset') {
            if(isAdmin(msg)){
                orders = {};
                payer = null;
                msg.react('👌');
            }else{
                msg.reply("tu cherches les problèmes toi ?")
            }
        } else {
            let unknownParams = [];
            // Prise de commande
            let paid = false;
            if(orders[msg.author.id] && orders[msg.author.id].paid) {
                paid = true;
            }
            if(paid) {
                msg.reply('Tu as déjà payé, commande non modifiable.');
                return;
            }
            let order = {
                paid
            };
            for(let i = 0; i < args.length; i++) {
                if(burgers.includes(args[i])) {
                    order.burger = args[i];
                } else if(boissons.includes(args[i])) {
                    order.boisson = args[i];
                } else if(/frites?/.test(args[i])) {
                    order.frite = true;
                } else {
                    unknownParams.push(args[i]);
                }
            }
            if(!unknownParams.length) {
                orders[msg.author.id] = order;
                msg.react('👌');
            } else {
                msg.reply('Unknown parameters : ' + unknownParams.join(' '));
            }
        }
    }
}

function calculatePrice(order) {
    if(order.burger && order.frite && order.boisson) {
        return '10,80€';
    } else if((order.burger && order.frite && !order.boisson) || (order.burger && !order.frite && order.boisson)) {
        return '9,80€';
    } else if(order.burger && !order.frite && !order.boisson) {
        return '8,50€';
    } else if(!order.burger && order.frite && order.boisson) {
        return '4,00€'
    } else {
        return '2,00€'
    }
}

module.exports = {
    handleMac
};