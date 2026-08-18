module.exports = {
    name: 'fechar',
    description: 'Fecha o grupo para apenas administradores falarem',
    adminOnly: true,

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;

        // Verifica se é um grupo
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, { text: '❌ Este comando só pode ser usado em grupos.' });
        }

        try {
            // 'announcement' = Apenas ADMs falam
            await sock.groupSettingUpdate(jid, 'announcement');
            
            await sock.sendMessage(jid, { 
                text: '🔒 *GRUPO FECHADO*\n\nA partir de agora, apenas administradores podem enviar mensagens.' 
            });
        } catch (error) {
            console.error('Erro ao fechar grupo:', error);
            await sock.sendMessage(jid, { 
                text: '❌ Erro: Verifique se eu sou administrador do grupo para poder fechá-lo.' 
            });
        }
    }
};