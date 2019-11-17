# README

This file contains rules to respect in term of participating in the bot project.

- snake_case
- tabulation (4 spaces)

## Return of the response

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

**result**

![image-20191117114153283](C:\Users\Thibaud\AppData\Roaming\Typora\typora-user-images\image-20191117114153283.png)

