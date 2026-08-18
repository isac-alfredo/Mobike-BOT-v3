const db = require('../database/db');

module.exports = {
    name: 'setregras',
    description: 'Define o texto das regras do grupo',
    adminOnly: true,

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const texto = args.join(' ');

        if (!texto) {
            return sock.sendMessage(jid, { 
                text: '⚠️ *Erro:* Você precisa digitar o texto das regras!\n\n*Exemplo:* !setregras 1. Sem Spam\n2. Sem links\n3. Respeite os ADMs.' 
            });
        }

        db.updateGroup(jid, { rules: texto });

        await sock.sendMessage(jid, { 
            text: '✅ *Sucesso:* As regras do grupo foram atualizadas!' 
        }, { quoted: msg });
    }
};