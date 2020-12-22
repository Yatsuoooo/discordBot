const Discord = require('discord.js'),
    client = new Discord.Client({
        partials: ['MESSAGE', 'REACTION'],
        fetchAllMembers: true
    }),
    config = require('./config.json'),
    fs = require('fs'),
    humanizeDuration = require('humanize-duration'),
    cooldown = new Set()
 
client.login(config.token)
client.commands = new Discord.Collection()
client.db = require('./db.json')
 
fs.readdir('./commands', (err, files) => {
    if (err) throw err
    files.forEach(file => {
        if (!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)
    })
})

client.on('message', message => {
    if (message.type !== 'DEFAULT' || message.author.bot) return

    if (message.guild) {
        
        if (!message.member.hasPermission('MANAGE_CHANNELS') && client.db.lockedChannels.includes(message.channel.id)) return message.delete() && message.channel.send('Ce salon est vérouillé !').then(sent => sent.delete({timeout: 5e3}))

        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            const duration = config.cooldown[message.channel.id]
            if (duration) {
                const id = `${message.channel.id}_${message.author.id}`
                if (cooldown.has(id)) {
                    message.delete()
                    return message.channel.send(`Ce salon est sous cooldown de ${humanizeDuration(duration, {language: 'fr'})}.`).then(sent => sent.delete({timeout: 5e3}))
                }
                cooldown.add(id)
                setTimeout(() => cooldown.delete(id), duration)
            }
    }
    if(message.content.startsWith("<@!771154209492041798>" || "<@771154209492041798>")){
        message.delete();
    const embed = new Discord.MessageEmbed()
    .setDescription(`**:Drapeau_France: : Prefix** \`/\` \n**:Server: : Ping** __${client.ws.ping}__ ms`)
    .setColor("#2F3136")
    message.channel.send(embed)
    }

    if (message.channel.id === '782653085897850911') {
        const args = message.content.trim().split(/ +/g)
        const prefix = "$"
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
        if (args[0] !== `${prefix}ticket`) {
            message.delete()
                }
            }
        }
    }

    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if (!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if (!command) return
    if (command.guildOnly && !message.guild) return message.channel.send('Cette commande ne peut être utilisé que dans un serveur !')
    command.run(message, args, client)
})

client.on('guildMemberAdd', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`${member} a rejoint le serveur, nous sommes désormais ${member.guild.memberCount} ! 🎉`)
    member.roles.add(config.greeting.role)
})
 
client.on('guildMemberRemove', member => {
    member.guild.channels.cache.get(config.greeting.channel).send(`${member.user.tag} a quitté le serveur... 😢`)
})

client.on('messageReactionAdd', (reaction, user) => {
    if (!reaction.message.guild || user.bot) return
    const reactionRoleElem = config.reactionRole[reaction.message.id]
    if (!reactionRoleElem) return
    const prop = reaction.emoji.id ? 'id' : 'name'
    const emoji = reactionRoleElem.emojis.find(emoji => emoji[prop] === reaction.emoji[prop])
    if (emoji) reaction.message.guild.member(user).roles.add(emoji.roles)
    else reaction.users.remove(user)
})
 
client.on('messageReactionRemove', (reaction, user) => {
    if (!reaction.message.guild || user.bot) return
    const reactionRoleElem = config.reactionRole[reaction.message.id]
    if (!reactionRoleElem || !reactionRoleElem.removable) return
    const prop = reaction.emoji.id ? 'id' : 'name'
    const emoji = reactionRoleElem.emojis.find(emoji => emoji[prop] === reaction.emoji[prop])
    if (emoji) reaction.message.guild.member(user).roles.remove(emoji.roles)
})

client.on('ready', () => {
    const statuses = [
        () => 'Visual Studio Code avec .Yatsuoo#0647',
        () => '$help',
        () => `${client.guilds.cache.size} serveurs`,
        () => `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0 - 1)} utilisateurs`
    ]
    let i = 0
    setInterval(() => {
        client.user.setActivity(statuses[i](), {type: 'STREAMING', url: 'https://twitch.tv/.Yatsuoo#0647'})
        i = ++i % statuses.length
    }, 1e4)
    setInterval(() => {
        const [bots, humans] = client.guilds.cache.first().members.cache.partition(member => member.user.bot)
        client.channels.cache.get(config.serversStats.humans).setName(`💎 Members : ${humans.size}`)
        client.channels.cache.get(config.serversStats.bots).setName(`🤖 Bots : ${bots.size}`)
        client.channels.cache.get(config.serversStats.total).setName(`⚜️ Total : ${client.guilds.cache.first().memberCount}`)
    }, 2e4)
    client.channels.cache.find(channel => channel.name === 'news-bot').send(":beginner: **Le bot est en ligne !**");
})

client.on('channelCreate', channel => {
    if (!channel.guild) return
    const muteRole = channel.guild.roles.cache.find(role => role.name === 'Muted')
    if (!muteRole) return
    channel.createOverwrite(muteRole, {
        SEND_MESSAGES: false,
        CONNECT: false,
        ADD_REACTIONS: false
    })
})

        //console log

    const figlet = require("figlet");
figlet.text(`The bot is online\nHello, World !`, function (err, data) {
      if (err) {
          console.log('Something went wrong');
          console.dir(err);
      }

      console.log(`═════════════════════════════════════════════════════════════════════════════`);
      console.log(data)
      console.log(`═════════════════════════════════════════════════════════════════════════════`);
    })