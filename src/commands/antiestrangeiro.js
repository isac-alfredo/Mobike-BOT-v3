const db =
    require('../database/db');

module.exports = {

    name: 'antiestrangeiro',

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
                    'Use:\n!antiestrangeiro on\n!antiestrangeiro off'

            });

        }

        const enabled =
            option === 'on';

        db.updateGroup(jid, {
            antiEstrangeiro: enabled
        });

        await sock.sendMessage(jid, {

            text:
                enabled
                    ? '🇲🇿✅ Anti-estrangeiro ativado.\nApenas números de Moçambique serão permitidos.'
                    : '🇲🇿❌ Anti-estrangeiro desativado.'

        });
    }
};