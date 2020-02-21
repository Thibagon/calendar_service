# README

This file contains rules to respect in term of participating in the bot project.

- snake_case
- tabulation (4 spaces)

## Return a response

Feel free to tag the user that ask the bot, by tagging I mean make use of `msg.reply` command so the bot will tag `@User [Response]` otherwise, you can just use `msg.channel.send(response)`.

## Graphical chart

Try to use the discord embed system with these default options

```javascript
let embed_result = new Discord.RichEmbed()
                    .setColor('#429127')
                    .setAuthor("Réponse automatique")
					.setTitle("Planning de le semaine")
```

and to perform the formatting, because discord use markdown you can integrate it in the embed like

```javascript
embed_result.setDescription("```Markdown\n"
                        +title_embed
                        +description_embed
                        +"```");
```
##Logging
You should consider using the logger.js file to add your log into the logging file.
```javascript
const logger = require('./logger.js');
logger.writeLog("somelog");
```