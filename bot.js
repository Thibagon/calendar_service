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
    if (msg.content.startsWith("!")) {
        if(msg.content.substr(1) == "ping")
            msg.reply('pong');
        if(msg.content.substr(1) == "sale")
            msg.reply('C\'est toi qui est sale !');
        if(msg.content.substr(1)== "salle"){

            //Link to the API here, temporary attacking my VPS with manually downloaded
            //This is the part where the CESI should bring his collaboration
            fetch('http://51.254.133.142/sample/sample.json')
            .then(res => res.json())
            .then(json => {

                let date = new Date();
                date = new Date(date.getFullYear(),date.getMonth()+1,date.getDate())
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
                console.log(planning_dates);
                console.log(date)
                console.log(date.getTime());
                console.log(planning_dates.includes(date.getTime()));

                //If the command is used without the week, remind when the next date is
                if(planning_dates.includes(date.getTime())){
                    let date_next = new Date(json[0].start.split('T')[0]);
                    let diffDays = Math.ceil(Math.abs(date_next - date) / (1000 * 60 * 60 * 24));
                    day_room = "L'alternance du cesi revient"+(diffDays<=1 ? " demain":" le "+date_next.toLocaleDateString()+" plus que "+ diffDays+
                        " jours");
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
    }
    msg.awaitReactions(burgerReact,{time:60000}).then(collected => {
        if (collected.size > 0)
            msg.reply("")
    });
});