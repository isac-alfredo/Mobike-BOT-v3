const {
    getTargetUser
} = require('../lib/utils');

const db =
    require('../database/db');

module.exports = {

    name: 'warn',

    adminOnly: true,

    async execute(sock, msg, args) {

        const jid =
            msg.key.remoteJid;

        const target =
            getTargetUser(msg);

        if (!target) {
            return sock.sendMessage(jid, {
                text:
                    '❌ Marque o usuário que receberá a advertência.'
            });
        }

        const motivo =
            args.join(' ') ||
            'Sem motivo informado';

        const total =
            db.addWarning(
                jid,
                target
            );

        await sock.sendMessage(jid, {

            text:
                `⚠️ Advertência aplicada!\n\n👤 @${target.split('@')[0]}\n📌 Motivo: ${motivo}\n🔢 Advertências: ${total}/3`,

            mentions: [target]

        });

        // 3 advertências = remoção
        if (total >= 3) {

            try {

                await sock.groupParticipantsUpdate(
                    jid,
                    [target],
                    'remove'
                );

                db.resetWarnings(
                    jid,
                    target
                );

                await sock.sendMessage(jid, {
                    text:
                        `🚫 @${target.split('@')[0]} atingiu 3 advertências e foi removido.`,

                    mentions: [target]
                });

            } catch (error) {

                console.error(error);

            }
        }
    }
};