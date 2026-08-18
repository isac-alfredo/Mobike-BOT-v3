const db = require('../database/db');

module.exports = {
    name: 'antifoto',
    adminOnly: true,
    execute: async (sock, msg, args) => {
        const jid = msg.key.remoteJid;
        const status = args[0]?.toLowerCase();

        if (status === 'on') {
            db.updateGroup(jid, { antiFoto: true }); // Nome tem que ser igual ao do db.js
            await sock.sendMessage(jid, { text: '✅ Anti-foto ligado!' });
        } else if (status === 'off') {
            db.updateGroup(jid, { antiFoto: false });
            await sock.sendMessage(jid, { text: '❌ Anti-foto desligado!' });
        } else {
            await sock.sendMessage(jid, { text: 'Use: !antifoto on ou off' });
        }
    }
};