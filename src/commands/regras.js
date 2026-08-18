const db = require('../database/db');
const config = require('../../config');

module.exports = {
    name: 'regras',
    description: 'Exibe as regras do grupo',
    adminOnly: false,

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, { text: '❌ Este comando só funciona em grupos.' });
        }

        const groupConfig = db.getGroup(jid);
        const metadata = await sock.groupMetadata(jid);

        const textoRegras = `
╔════════════════════╗
   📜 *REGRAS DO GRUPO*
╚════════════════════╝
👥 *Grupo:* ${metadata.subject}

${groupConfig.rules}

╚════════════════════╝
_MOBIKE BOT - GESTÃO ELITE_ 🇲🇿`;

        await sock.sendMessage(jid, { 
            text: textoRegras,
            mentions: [msg.key.participant || jid]
        }, { quoted: msg });
    }
};