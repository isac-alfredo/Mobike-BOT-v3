const db = require('../database/db');

module.exports = {
    name: 'setwelcome',
    description: 'Define a mensagem de boas-vindas com foto e nome',
    adminOnly: true,
    execute: async (sock, msg, args) => {
        const jid = msg.key.remoteJid;
        const text = args.join(' ');

        if (!text) {
            return sock.sendMessage(jid, { 
                text: `⚠️ *Como configurar o Boas-Vindas:*
                
Use as tags abaixo no seu texto:
👉 *@user* - Menciona o usuário (azul)
👉 *@name* - Escreve o nome/número do usuário
👉 *@group* - Escreve o nome do grupo

*Exemplo:*
!setwelcome Olá @name! Você acaba de entrar no grupo @group. Seja bem-vindo @user!` 
            });
        }

        db.updateGroup(jid, { welcomeMessage: text });
        await sock.sendMessage(jid, { text: '✅ Mensagem de boas-vindas com foto configurada!' });
    }
};