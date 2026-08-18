module.exports = {
    name: 'abrir',
    description: 'Abre o grupo para todos os membros falarem',
    adminOnly: true,

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;

        // Verifica se é um grupo
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, { text: '❌ Este comando só pode ser usado em grupos.' });
        }

        try {
            // 'not_announcement' = Todos os membros falam
            await sock.groupSettingUpdate(jid, 'not_announcement');
            
            await sock.sendMessage(jid, { 
                text: '🔓 *GRUPO ABERTO*\n\nAgora todos os membros podem enviar mensagens novamente.' 
            });
        } catch (error) {
            console.error('Erro ao abrir grupo:', error);
            await sock.sendMessage(jid, { 
                text: '❌ Erro: Verifique se eu sou administrador do grupo para poder abri-lo.' 
            });
        }
    }
};