module.exports = {
    name: 'restart',
    description: 'Reinicia o bot',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        await sock.sendMessage(msg.key.remoteJid, { text: '🔄 Reiniciando o sistema agora...' });
        
        // Finaliza o processo. O start.sh ou PM2 vai ligar ele de novo.
        setTimeout(() => {
            process.exit(0);
        }, 1000);
    }
};