const {
    getTargetUser
} = require('../lib/utils');

const db =
    require('../database/db');

module.exports = {

    name: 'clearwarn',

    adminOnly: true,

    async execute(sock, msg) {

        const jid =
            msg.key.remoteJid;

        const target =
            getTargetUser(msg);

        if (!target) {
            return sock.sendMessage(jid, {
                text:
                    '❌ Marque o usuário.'
            });
        }

        db.resetWarnings(
            jid,
            target
        );

        await sock.sendMessage(jid, {

            text:
                `✅ Advertências de @${target.split('@')[0]} foram removidas.`,

            mentions: [target]

        });
    }
};