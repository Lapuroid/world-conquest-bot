module.exports = {
    name: 'ping',
    description: "check bot latency",
    cooldown: 2,
    async execute(message, args, client) { 
        var resMsg = await message.channel.send('Ping is being appreciated... :bar_chart:');
        resMsg.edit('Ping: ' + Math.round((resMsg.createdTimestamp - message.createdTimestamp) - client.ws.ping) + ' :ping_pong:');
    }
}