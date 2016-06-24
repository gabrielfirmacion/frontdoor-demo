if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: false,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

var userAnswers = {
    moveInDate: "",
    budget: "",
    neighborhood: ""
};

var listings = {
    glen: {
        budget: {
            3000: {
                moveInDate: {
                    asap: ['https://sfbay.craigslist.org/sfc/apa/5638755989.html', 'https://sfbay.craigslist.org/sfc/apa/5636791988.html'],
                    notasap: ['no listings available right now']
                }
            },
            4000: {
                moveInDate: {
                    asap: ['https://sfbay.craigslist.org/sfc/apa/5638079297.html', 'https://sfbay.craigslist.org/sfc/apa/5603880598.html'],
                    notasap: ['no listings available right now']
                }
            }
        }
    },
    mission: {
        budget: {
            3000: {
                moveInDate: {
                    asap: ['https://sfbay.craigslist.org/sfc/apa/5630349511.html','https://sfbay.craigslist.org/sfc/apa/5635056198.html'],
                    notasap: ['https://sfbay.craigslist.org/sfc/apa/5638534589.html']
                }
            },
            4000: {
                moveInDate: {
                    asap: ['http://sfbay.craigslist.org/sfc/apa/5640545004.html','https://sfbay.craigslist.org/sfc/apa/5638851010.html'],
                    notasap: ['no listings available right now']
                }
            }
        }
    },
    SOMA: {
        budget: {
            3000: {
                moveInDate: {
                    asap: ['http://sfbay.craigslist.org/sfc/apa/5649653785.html','http://sfbay.craigslist.org/sfc/apa/5640230538.html'],
                    notasap: ['https://sfbay.craigslist.org/sfc/apa/5637721697.html','https://sfbay.craigslist.org/sfc/apa/5628136435.html']
                }
            },
            4000: {
                moveInDate: {
                    asap: ['http://sfbay.craigslist.org/sfc/apa/5639519965.html','https://sfbay.craigslist.org/sfc/apa/5633060549.html'],
                    notasap: ['https://sfbay.craigslist.org/sfc/apa/5638834890.html','https://sfbay.craigslist.org/sfc/apa/5637681672.html']
                }
            }
        }
    }
};

controller.hears(['Hello', 'Hi','Hey'], 'direct_message,direct_mention,mention', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        bot.reply(message, "Hello there. My name is Stew - I'm kind of your personal assistant. Moving soon? Tell me when? What neighborhood are you interested in? What's your rent price? Should we get started?");
    });
});

controller.hears(['Yes', 'yes'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        bot.reply(message, "Great! When are you moving? You can say 'in the next 30 days' or 'not soon' ");
    });
});


controller.hears(['in the next 30 days', 'not soon'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (message.text === 'in the next 30 days') {
            userAnswers['moveInDate'] = 'asap'
        } else {
            userAnswers['moveInDate'] = 'notasap'
        };
        bot.reply(message, "Ok, and what is your budget? As of now, you can say '3000' or '4000' ");
    });
});

controller.hears(['No', 'no','nope','Nope'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        bot.reply(message, "Sure thing! All good in the 'Hood - Hola at me anytime, just say 'Hey'");
    });
});

controller.hears(['3000', '4000'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
       if (message.text === '3000') {
            userAnswers['budget'] = '3000'
       } else {
            userAnswers['budget'] = '4000'
       }
       bot.reply(message, "Great! Which 'hood are you looking into? As of now, you can say 'glen park', 'mission' or 'SOMA'");
    });
});

controller.hears(['glen park', 'mission', 'SOMA'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (message.text === 'glen park') {
             userAnswers['neighborhood'] = 'glen'
        } else if (message.text === 'mission')  {
             userAnswers['neighborhood'] = 'mission'
        } else {
             userAnswers['neighborhood'] = 'SOMA'
        }
        availableListings = listings[userAnswers['neighborhood']]['budget'][userAnswers['budget']]['moveInDate'][userAnswers['moveInDate']]
        bot.reply(message, "I found cool digs you might be interested in: " + availableListings[0] + ' & ' + availableListings[1] );
    });
});

controller.hears(['Thanks', 'thanks','Thank you','thank you'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        bot.reply(message, "You'd do the same for me :)");
    });
});
