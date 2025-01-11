const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();

// Create the bot client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel]
  });

const TOKEN = process.env.BOT_TOKEN;

client.login(TOKEN);