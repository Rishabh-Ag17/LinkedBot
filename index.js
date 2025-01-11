const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { spawn } = require('child_process');

// Create the bot client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel]
  });

const TOKEN = process.env.BOT_TOKEN;

// Parse Resume Function
async function parseResumeWithSpacy(filePath) {
    return new Promise((resolve, reject) => {
      const process = spawn('python', ['spacy_parser.py', filePath]);
  
      let output = '';
      process.stdout.on('data', (data) => {
        output += data.toString();
      });
  
      process.stderr.on('data', (data) => {
        console.error('Error:', data.toString());
      });
  
      process.on('close', (code) => {
        if (code === 0) {
          resolve(JSON.parse(output));
        } else {
          reject('Error running spaCy parser.');
        }
      });
    });
  }


client.login(TOKEN);