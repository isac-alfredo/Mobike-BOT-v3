module.exports = {
    name: 'ping',
    adminOnly: false,
    execute: async (sock, msg, args) => {
        await sock.sendMessage(msg.key.remoteJid, { text: '🏓 Pong!' });
    }
};