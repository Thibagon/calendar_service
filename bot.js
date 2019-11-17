const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(auth.token);

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
    } else if(msg.content.startsWith('!mac')) {
        let args = msg.content.split(' ');
        args.splice(0, 1);
        handleMac(msg, args);
    }
});


let orders = {};

function handleMac(msg, args) {
    const burgers = ['classique', 'chicken', 'bbq', 'comte', 'basque', 'montagnard', 'veggie'];
    const boissons = ['coca', 'icetea', 'orangina'];
    if(args.length === 0) {
        msg.reply('Utilisation : !mac <burger> [<boisson>] [frite]');
        msg.reply('Liste des burgers : ' + burgers.join(', '));
        msg.reply('Liste des boissons : ' + boissons.join(', '));
    } else {
        if(args[0] === 'resume') {
            // Résumé de la commande
            const resume = {
                burgers: {},
                boissons: {},
                frites: 0,
            };
            for(let key in orders) {
                if(!orders.hasOwnProperty(key)) {
                    continue;
                }
                let order = orders[key];
                console.log('resumiing order ', order);
                if(order.frite) {
                    resume.frites++;
                    console.log('Adding frite');
                }
                if(order.burger && !(order.burger in resume.burgers)) {
                    resume.burgers[order.burger] = 1;
                    console.log('Adding burger ', order.burger);
                } else if(order.burger) {
                    resume.burgers[order.burger]++;
                    console.log('Adding burger ', order.burger);
                }
                if(order.boisson && !(order.boisson in resume.boissons)) {
                    resume.boissons[order.boisson] = 1;
                    console.log('Adding boisson ', order.boisson);
                } else if(order.boisson) {
                    resume.boissons[order.boisson]++;
                    console.log('Adding boisson ', order.boisson);
                }
            }
            let resultBurgers = 'Burgers : ';
            for(let key in resume.burgers) {
                if(!resume.burgers.hasOwnProperty(key)) {
                    continue;
                }
                resultBurgers += resume.burgers[key] + ' ' + key + ', ';
            }
            resultBurgers.slice(0, -2);
            msg.reply(resultBurgers);
            let resultBoissons = 'Boissons : ';
            for(let key in resume.boissons) {
                if(!resume.boissons.hasOwnProperty(key)) {
                    continue;
                }
                resultBoissons += resume.boissons[key] + ' ' + key + ', ';
            }
            resultBoissons.slice(0, -2);
            msg.reply(resultBoissons);
            msg.reply(resume.frites + ' frites');
        } else if(args[0] === 'reset') {
            orders = {};
            msg.react('👌');
        } else {
            let unknownParams = [];
            // Prise de commande
            let order = {};
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
                console.log('Order placed : ', order);
            } else {
                msg.reply('Unknown parameters : ' + unknownParams.join(' '));
            }
        }
    }
}