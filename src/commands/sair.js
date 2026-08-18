module.exports = {
    name: 'sair',
    description: 'Faz o bot sair do grupo atual',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const jid = msg.key.remoteJid;
        if (!jid.endsWith('@g.us')) return;

        await sock.sendMessage(jid, { text: '👋 O proprietário solicitou minha saída. Até logo!' });
        await sock.groupLeave(jid);
    }
};