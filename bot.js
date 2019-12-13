const Discord = require('discord.js');
const fetch = require('node-fetch');
const client = new Discord.Client();
const auth = require('./auth.json');
const burgerEmoji = "🍔";
const burgerReact = reaction => reaction.emoji.name === burgerEmoji;
const days = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
const role_bot_commander = ["bot_commander","Admin","Délégués"];
const talked_recently = new Set();


client.on('ready', channel => {
    console.log(`Logged in as ${client.user.tag}!`);
    var chan = client.channels.find(val => val.type == "text" && val.position == "0");
    chan.send("Guess who's back ?! MSI Assistant !");
});

client.on('disconnect', channel => {
    console.log(`Bot disconnected`);
    var chan = client.channels.find(val => val.type == "text" && val.position == "0");
    chan.send("Je vais faire un petit somme, à plus tard");
});
if (require.main === module) {
    client.login(auth.token);
}

client.on('message', msg => {
    let args = msg.content.split(' ');
    let command = args[0];
    args.splice(0, 1);

    if (command.startsWith("!")) {
        let d = new Date()
        console.log("["+d.toLocaleDateString()+" "+d.toLocaleTimeString()+"] "+ msg.author.username+" : "+msg.content);
        if(command.substr(1) == "ping")
            msg.reply('pong');
        if(command.substr(1) == "sale")
            msg.reply('C\'est toi qui est sale !');
        if(command.substr(1) == 'mac') {
            handleMac(msg, args);
        }
        if(command.substr(1)== "salle") {
            room_list(msg);
        }

    }else if(msg.content.toLowerCase().includes('bot')){
        if(msg.content.toLowerCase().includes('de merde')) {
            let embed_result = new Discord.RichEmbed()
                .setColor('#f6ffff')
                .setImage("https://media.giphy.com/media/we1KGq2yvN65a/giphy.gif");
            msg.reply(embed_result);
        }else{
            let embed_result = new Discord.RichEmbed()
                .setColor('#f6ffff')
                .setImage("https://media0.giphy.com/media/CYUDHVmioGETu/giphy.gif");
            msg.reply(embed_result);
        }
    }
});

let orders = {};

function handleMac(msg, args) {
    const burgers = ['classique', 'chicken', 'bbq', 'comte', 'basque', 'montagnard', 'veggie'];
    const boissons = ['coca', 'icetea', 'orangina'];
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
            for(let key in orders) {
                if(!orders.hasOwnProperty(key) || !orders[key]) {
                    continue;
                }
                let order = orders[key];

                if(order.frite) {
                    resume.frites++;
                }
                if(order.burger && !(order.burger in resume.burgers)) {
                    resume.burgers[order.burger] = 1;
                } else if(order.burger) {
                    resume.burgers[order.burger]++;
                }
                if(order.boisson && !(order.boisson in resume.boissons)) {
                    resume.boissons[order.boisson] = 1;
                } else if(order.boisson) {
                    resume.boissons[order.boisson]++;
                }
            }
            let resultBurgers = '**Burgers** : ';
            for(let key in resume.burgers) {
                if(!resume.burgers.hasOwnProperty(key)) {
                    continue;
                }
                resultBurgers += resume.burgers[key] + ' ' + key + ', ';
            }
            resultBurgers = resultBurgers.slice(0, -2);
            let resultBoissons = '**Boissons **: ';
            for(let key in resume.boissons) {
                if(!resume.boissons.hasOwnProperty(key)) {
                    continue;
                }
                resultBoissons += resume.boissons[key] + ' ' + key + ', ';
            }
            resultBoissons = resultBoissons.slice(0, -2);
            embed_result.setDescription("- "+resultBurgers+"\n"
                +"- "+resultBoissons+"\n"
                +"- **Frites ** : "+resume.frites+"\n"
            );
            msg.channel.send(embed_result);
        } else if(args[0] === 'reset') {
            if(is_bot_commander(msg)){
                orders = {};
                msg.react('👌');
            }else{
                msg.reply("tu cherches les problèmes toi ?")
            }
        } else if(args[0] === 'cancel') {
            orders[msg.author.id] = undefined;
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
            } else {
                msg.reply('Unknown parameters : ' + unknownParams.join(' '));
            }
        }
    }
}

function room_list(msg){
    if (!talked_recently.has(msg.author.id)) {
        //Bot commander by pass the rules
        if (!is_bot_commander(msg)) {
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

    //Link to the API here, temporary attacking my VPS with manually downloaded
    //This is the part where the CESI should bring his collaboration
    fetch('http://51.254.133.142/sample/sample.json')
        .then(res => res.json())
        .then(json => {

            let date = new Date();
            //date_time_yyyymmdd will be used to compare the days in timestamp format
            let date_time_yyyymmdd = new Date(date.getFullYear(),date.getMonth()+1,date.getDate())
            let i = date.getDay();
            let day_room = new Object();
            let date_current_day;
            let planning_dates = [];
            let embed_result = new Discord.RichEmbed()
                .setColor('#429127')
                .setAuthor("Réponse automatique");

            for(itr in json){
                planning_dates.push(new Date(
                    json[itr].start.split('T')[0].split('-')[0],
                    json[itr].start.split('T')[0].split('-')[1],
                    json[itr].start.split('T')[0].split('-')[2]
                )
                    .getTime());
            }

            //If the command is used without the week, remind when the next date is
            if(!planning_dates.includes(date_time_yyyymmdd.getTime())){
                let date_next = new Date(json[0].start.split('T')[0]);
                let diffDays = Math.ceil((date_next - date) / (1000 * 60 * 60 * 24));

                day_room = "L'alternance du cesi revient bientôt !";
                /*
                if(diffDays==1){
                    day_room += " demain";
                }else if(diffDays > 1){
                    day_room +=" le "+date_next.toLocaleDateString()+" plus que "+ diffDays+ " jours";
                }else if(diffDays < 0){
                    day_room = "L'alternance est passé depuis "+ Math.abs(diffDays) +" jour"+(diffDays!=-1 ? "":"s");
                }*/

                embed_result.setTitle(day_room);

            }else {
                var rooms_current_day = [];
                for (let key in json) {
                    if (json[key].start.split('T')[0] != date_current_day) {
                        rooms_current_day = [];
                    }
                    date_current_day = json[key].start.split('T')[0];
                    if(json[key].salles.length>1){
                        var temp_salles = "";
                        for(salle in json[key].salles){
                            temp_salles += json[key].salles[salle].nomSalle.split(' ')[1] +"/";
                        }
                        temp_salles = temp_salles.slice(0,-1);
                        rooms_current_day.push(temp_salles);
                    }else{
                        rooms_current_day.push(json[key].salles[0].nomSalle.split(' ')[1]);
                    }
                    day_room[days[new Date(json[key].start.split('T')[0]).getDay()]] = Array.from(new Set(rooms_current_day));
                }

                let max_length_string = 0;
                for(i in day_room){
                    day_room[i].toString().length>max_length_string ? max_length_string = day_room[i].toString().length : '';
                }

                let title_embed = " Jour         | Salle"+" ".repeat(max_length_string);
                let str_title = "-";
                let description_embed = "";
                let separator_index;

                separator_index = title_embed.indexOf("|")+1;
                title_embed = "|"+title_embed+"\n";

                //Add separator between table head and body
                let head_body_separator ="|"+"-".repeat(separator_index-1)+"|";
                head_body_separator +="-".repeat(max_length_string)+"|\n";
                title_embed += head_body_separator;

                //Build the body table
                for(day in day_room){
                    let day_temp_line = "";
                    let room_temp_line = "";

                    //Add the middle separator at the right place
                    day_temp_line += "| "+day;
                    day_temp_line += " ".repeat(separator_index-day_temp_line.length);

                    //Add the closing pipe at the right place
                    room_temp_line += "|"+day_room[day];
                    if(max_length_string-room_temp_line.length >= 0) {
                        room_temp_line += " ".repeat((max_length_string - room_temp_line.length)+1) + "|\n";
                    }else{
                        room_temp_line += "|\n";
                    }

                    description_embed += day_temp_line+room_temp_line;
                }

                //Build a markdown table in an embed response
                embed_result.setTitle("Planning de le semaine");
                embed_result.setDescription("```Markdown\n"
                    +title_embed
                    +description_embed
                    +"```");

            }
            msg.channel.send(embed_result);
        });
}

function is_bot_commander(msg){
    if(msg.member != null)
        return msg.member.roles.some(r=>role_bot_commander.includes(r.name))
    else
        return false;
}

module.exports = {
    handleMac,
};
