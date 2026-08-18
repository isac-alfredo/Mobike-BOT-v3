module.exports = {
    name: 'join',
    description: 'Faz o bot entrar em um grupo via link',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const link = args[0];
        if (!link) return sock.sendMessage(msg.key.remoteJid, { text: '⚠️ Envie o link do grupo!' });

        try {
            // Extrai o código do link (o que vem depois de chat.whatsapp.com/)
            const code = link.split('https://chat.whatsapp.com/')[1];
            await sock.groupAcceptInvite(code);
            await sock.sendMessage(msg.key.remoteJid, { text: '✅ Entrei no grupo com sucesso!' });
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Erro: Link inválido ou fui banido deste grupo.' });
        }
    }
};