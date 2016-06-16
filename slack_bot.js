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

controller.hears(['Hey Stew, I need help', 'I need help'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + "I'll be happy to help you in your apartment search. When are you moving?");
        } else {
            bot.reply(message, "Hello. I'll be happy to help you in your apartment search. When are you moving?");
        }
    });
});

controller.hears(['in the next 30 days', 'not this month'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, "Ok, and what is your budget?");
        } else {
            bot.reply(message, "Ok, and what is your budget?");
        }
    });
});

controller.hears(['3000', '4000'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, "Great! Which neighborhood are you looking to move into?");
        } else {
            bot.reply(message, "Great! Which neighborhood are you looking to move into?");
        }
    });
});

