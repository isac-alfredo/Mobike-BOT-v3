const db = require('../database/db');

module.exports = {
    name: 'antispam',
    description: 'Ativa/Desativa a proteção contra spam no grupo',
    adminOnly: true,
    execute: async (sock, msg, args) => {
        const jid = msg.key.remoteJid;
        const op = args[0]?.toLowerCase();

        if (op === 'on') {
            db.updateGroup(jid, { antiSpam: true });
            await sock.sendMessage(jid, { text: '🛡️ *Anti-Spam Ativado!* Membros que enviarem mensagens muito rápido serão avisados.' });
        } else if (op === 'off') {
            db.updateGroup(jid, { antiSpam: false });
            await sock.sendMessage(jid, { text: '✅ *Anti-Spam Desativado.*' });
        } else {
            await sock.sendMessage(jid, { text: '❓ Use: *!antispam on* ou *off*' });
        }
    }
};