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
                    asap: ['https://sfbay.craigslist.org/sfc/apa/5634975188.html','https://sfbay.craigslist.org/sfc/apa/5638851010.html'],
                    notasap: ['no listings available right now']
                }
            }
        }
    },
    SOMA: {
        budget: {
            3000: {
                moveInDate: {
                    asap: ['https://sfbay.craigslist.org/sfc/apa/5638879629.html','https://sfbay.craigslist.org/sfc/apa/5638705853.html'],
                    notasap: ['https://sfbay.craigslist.org/sfc/apa/5637721697.html','https://sfbay.craigslist.org/sfc/apa/5628136435.html']
                }
            },
            4000: {
                moveInDate: {
                    asap: ['https://sfbay.craigslist.org/sfc/apa/5638898502.html','https://sfbay.craigslist.org/sfc/apa/5633060549.html'],
                    notasap: ['https://sfbay.craigslist.org/sfc/apa/5638834890.html','https://sfbay.craigslist.org/sfc/apa/5637681672.html']
                }
            }
        }
    }
};

controller.hears(['Hello', 'Hi','Hey'], 'direct_message,direct_mention,mention', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        bot.reply(message, "Hello! I can help you with your apartment search. Do you need help?");
    });
});

controller.hears(['Yes'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        bot.reply(message, "I'll be happy to help you in your apartment search. When are you moving? You can say 'in the next 30 days' or 'not this month' ");
    });
});

controller.hears(['in the next 30 days', 'not this month'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (message.text === 'in the next 30 days') {
            userAnswers['moveInDate'] = 'asap'
        } else {
            userAnswers['moveInDate'] = 'notasap'
        };
        bot.reply(message, "Ok, and what is your budget? As of now, you can say '3000' or '4000' ");
    });
});

controller.hears(['3000', '4000'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
       if (message.text === '3000') {
            userAnswers['budget'] = '3000'
       } else {
            userAnswers['budget'] = '4000'
       }
       bot.reply(message, "Great! Which neighborhood are you looking to move into? As of now, you can say 'glen park', 'mission' or 'SOMA' ");
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
        bot.reply(message, "Here are some listings you might be interested in: " + availableListings[0] + ' & ' + availableListings[1] );
    });
});

