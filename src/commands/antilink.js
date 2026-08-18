const db =
    require('../database/db');

module.exports = {

    name: 'antilink',

    adminOnly: true,

    async execute(sock, msg, args) {

        const jid =
            msg.key.remoteJid;

        const option =
            args[0]?.toLowerCase();

        if (
            option !== 'on' &&
            option !== 'off'
        ) {

            return sock.sendMessage(jid, {
                text:
                    'Use:\n!antilink on\n!antilink off'
            });

        }

        const enabled =
            option === 'on';

        db.updateGroup(jid, {
            antilink: enabled
        });

        await sock.sendMessage(jid, {

            text:
                enabled
                    ? '🔗✅ Anti-link ativado.'
                    : '🔗❌ Anti-link desativado.'

        });
    }
};