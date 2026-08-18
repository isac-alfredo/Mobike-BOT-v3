module.exports = {
    name: 'info',
    description: 'Informações do bot',
    category: 'util',
    execute: async (sock, msg, args) => {
        const infoText = `🤖 *Mobike Bot ADM*\n\n✅ Sistema Online\n📂 Plugins carregados\n🛡️ Anti-link pronto`;
        await sock.sendMessage(msg.key.remoteJid, { text: infoText }, { quoted: msg });
    }
};