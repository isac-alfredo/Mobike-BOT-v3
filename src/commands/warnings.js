const {
    getTargetUser
} = require('../lib/utils');

const db =
    require('../database/db');

module.exports = {

    name: 'warnings',

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

        const total =
            db.getWarnings(
                jid,
                target
            );

        await sock.sendMessage(jid, {

            text:
                `⚠️ @${target.split('@')[0]} possui ${total}/3 advertências.`,

            mentions: [target]

        });
    }
};