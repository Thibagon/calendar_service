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
## Logging
You should consider using the logger.js file to add your log into the logging file.
```javascript
const logger = require('./logger.js');
logger.writeLog("somelog");
```

## Production
1. Save you work on your branch
2. Push your local branch on the configuration
    `git push`
3. Place yourself on the master
    `git checkout master`
4. Rebase the work you have done on your branch on the top of master
    `git rebase <branch>`
5. Resolve any **conflicts**
6. **Increment** the version number in `package.json`
7. Commit your work
8. Push the master
9. Create a tag, use the format 0.0.0v
    `tag -a <version number> -m "<Description of the version>"`
10. Share the tag
    `git push origin <version number>`
11. On the production server, get the changes by placing the server on the tag like so
    `git checkout <version number>`
