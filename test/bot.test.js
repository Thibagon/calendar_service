let assert = require('assert');
let bot = require('../bot');
const Discord = require('discord.js');
let spy = require('spy');

describe('handleMac', function() {
    it('should reply with usage instruction without arguments', function() {
        const burgers = ['classique', 'chicken', 'bbq', 'comte', 'basque', 'montagnard', 'veggie'];
        const boissons = ['coca', 'icetea', 'orangina'];
        let expectedReply = new Discord.RichEmbed()
            .setColor('#b93323')
            .setAuthor("Réponse automatique")
            .setTitle("Les Mecs Au Camion").setDescription('__Utilisation : !mac <burger> [<boisson>] [frite]__\n'
                +'**Liste des burgers** : ' + burgers.join(', ')+'\n'
                +'**Liste des boissons** : ' + boissons.join(', ')+'\n'
            );

        let replySpy = spy();
        let msg = {
            channel: {
                send: replySpy,
            }
        };
        bot.handleMac(msg, []);
        assert.equal(replySpy.calledWith(expectedReply), true);
    });

    it('should reset the orders', function() {
        let reactSpy = spy();
        let msg = {
            react: reactSpy,
            member: {
                roles: [{name: 'Admin'}]
            }
        };
        bot.handleMac(msg, ['reset']);
        assert.equal(reactSpy.calledWith('👌'), true);
    });

    it('should cancel someone\'s order', function() {
        let reactSpy = spy();
        let msg = {
            react: reactSpy,
            author: {
                id: 'authorId',
            }
        };
        bot.handleMac(msg, ['cancel']);
        assert.equal(reactSpy.calledWith('👌'), true);
    });
});