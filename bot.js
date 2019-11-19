const Discord = require('discord.js');
const fetch = require('node-fetch')
const client = new Discord.Client();
const auth = require('./auth.json');
const burgerEmoji = "🍔";
const burgerReact = reaction => reaction.emoji.name === burgerEmoji;
const days = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(auth.token);

client.on('message', msg => {
    let args = msg.content.split(' ');
    let command = args[0];
    args.splice(0, 1);

    if (command.startsWith("!")) {
        if(command.substr(1) == "ping")
            msg.reply('pong');
        if(command.substr(1) == "sale")
            msg.reply('C\'est toi qui est sale !');
        if(command.substr(1) == 'mac') {
            handleMac(msg, args);
        }
        if(command.substr(1)== "salle")
            room_list(msg);

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
                if(!orders.hasOwnProperty(key)) {
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
            } else {
                msg.reply('Unknown parameters : ' + unknownParams.join(' '));
            }
        }
    }
}

function room_list(msg){
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

                day_room = "L'alternance du cesi revient";
                if(diffDays==1){
                    day_room += " demain";
                }else if(diffDays > 1){
                    day_room +=" le "+date_next.toLocaleDateString()+" plus que "+ diffDays+ " jours";
                }else if(diffDays < 0){
                    day_room = "L'alternance est passé depuis "+ Math.abs(diffDays) +" jour"+(diffDays!=-1 ? "":"s");
                }

                embed_result.setTitle(day_room);

            }else {
                for (let key in json) {
                    if (json[key].start.split('T')[0] != date_current_day) {
                        //If it is the first iteration
                        if (date_current_day != null) {
                            //Put the duplicates away
                            if(i+1>0 && i+1<6 ){
                                day_room[days[i]] = Array.from(new Set(rooms_of_the_day));
                                i++;
                            }
                        }
                        var rooms_of_the_day = [];
                        date_current_day = json[key].start.split('T')[0];
                    }

                    if (i <= 5) {
                        //Fill associated table and takes out the rooms number
                        rooms_of_the_day.push(json[key].salles[0].nomSalle.split(' ')[1]);
                    }

                    //If it is the last iteration
                    if (key == json.length - 1) {
                        if(i>0 && i<6)
                            day_room[days[i]] = Array.from(new Set(rooms_of_the_day));
                    }
                }

                let title_embed = " Jour         | Salle            |";
                let str_title = "-";
                let description_embed = "";
                let separator_index;
                let closing_line_index = title_embed.length;

                separator_index = title_embed.indexOf("|")+1;
                title_embed = "|"+title_embed+"\n";

                //Add separator between table head and body
                let head_body_separator = "|";
                for(let space = separator_index - head_body_separator.length;space != 0;space --){
                    head_body_separator += "-"
                }
                head_body_separator += "|";
                for(let space = closing_line_index - head_body_separator.length;space != 0;space --){
                    head_body_separator += "-"
                }
                head_body_separator += "|\n";
                title_embed += head_body_separator;

                //Build the body table
                for(day in day_room){
                    let temp_line = "";
                    temp_line += "| "+day;
                    //Add the middle separator at the right place
                    if(temp_line.length < separator_index) {
                        for(let space = separator_index - temp_line.length;space != 0;space --){
                            temp_line += " ";
                        }
                    }
                    temp_line += "|"+day_room[day];
                    //Add the closing pipe at the right place
                    if(temp_line.length < closing_line_index) {
                        for(let space = closing_line_index - temp_line.length;space != 0;space --){
                            temp_line += " ";
                        }
                        temp_line += "|\n";
                    }
                    description_embed += temp_line;
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