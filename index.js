const {Client,
      Collection   } = require("discord.js");
const client = new Client({
  disableEveryone: true
});
const { prefix, token } = require("./config.json");//Coded By SLote
const ms = require("ms");
const http = require("http");
const fetch = require("node-fetch");
const discord = require("discord.js");
const fs = require("fs");
const bodyParser = require("body-parser");
const db = require("quick.db");
//-------Ping------------
 const express = require("express");
 const app = express();

 app.get("/", (req, res) => {
	 res.send("Pinging");
	
 });

 app.listen(3000, () => {
	 console.log("Server Started");
 });

//--------Message-------
client.on('message', async message => {
  if (message.author.bot) return;
  if (!message.guild) return;
  
  if (!message.content.startsWith(prefix)) return;

  // If message.member is uncached, cache it.
  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);

  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  // Get the command
  let command = client.commands.get(cmd);
  // If none is found, try to find it by alias
  if (!command) command = client.commands.get(client.aliases.get(cmd));
  if (!command) return;
  if (command) command.run(client, message, args);
  
});
//--Optional
client.on("message", message => {
  if (message.content === `${prefix}info`) {
    return message.channel.send(`--------Monitoring--------\n\n**[👤] User ${user}\n\n[🌐] Website ${count}\n\n[🔴] Pinging ${rounds}**\n\n----------------------------`);
  }
});

app.use(express.static("public"));

app.use(bodyParser.json());

let count = 0;
let invcount = 0;
let user = 0;
let rounds = 0;

setInterval(function() {
  let database = JSON.parse(fs.readFileSync("./link.json", "utf8"));
  count = 0;
  invcount = 0;
  user = database.length;
  rounds++;

  database.forEach(m => {
    m.link.forEach(s => {
      count++;

      fetch(s).catch(err => {
        invcount++;
      });
    });
  });
  client.channels.cache.get("876750982283948042").send(`[•] Visiting ${count} Website ✅ [${rounds}]`)
  console.log(`--------Ping--------\n\n[•]Ping Ke${rounds}\n\n[•]TotalWeb${count}\n\n[•]User${user}`)
  client.user.setActivity(`${count} Web | ${prefix}help`, { type : 'WATCHING' });
}, 60000);

app.get("/", async (request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end(
    `Monitoring ${count} websites and ${invcount} Invalid website with ${user} Users, Fetch Number : ${rounds}`
  );
});

client.on("ready", async () => {
  client.user.setActivity(``);
  console.log("Ready to ping some bots");
});
//--------------------------------------------------- F U N C T I O N S ---------------------------------------------

function send(content, message, color) {
  if (!color) color = "GREEN";

  return message.channel.send({
    embed: { description: content, color: color }
  });
}
//----Handler------
client.commands = new Collection();
client.aliases = new Collection();

['command'].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});


client.login(token);
