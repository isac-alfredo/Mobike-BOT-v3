const db =
    require('../database/db');

module.exports = {

    name: 'welcome',

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
                    'Use:\n!welcome on\n!welcome off'
            });

        }

        const enabled =
            option === 'on';

        db.updateGroup(jid, {
            welcome: enabled
        });

        await sock.sendMessage(jid, {

            text:
                enabled
                    ? '👋✅ Boas-vindas ativadas.'
                    : '👋❌ Boas-vindas desativadas.'

        });
    }
};