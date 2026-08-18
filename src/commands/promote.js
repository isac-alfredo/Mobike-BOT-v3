const { getTargetUser } =
    require('../lib/utils');

module.exports = {

    name: 'promote',

    adminOnly: true,

    async execute(sock, msg) {

        const jid = msg.key.remoteJid;

        const target =
            getTargetUser(msg);

        if (!target) {
            return sock.sendMessage(jid, {
                text:
                    '❌ Marque o usuário que deseja promover.'
            });
        }

        try {

            await sock.groupParticipantsUpdate(
                jid,
                [target],
                'promote'
            );

            await sock.sendMessage(jid, {
                text:
                    `👑 @${target.split('@')[0]} agora é administrador.`,
                mentions: [target]
            });

        } catch (error) {

            console.error(error);

            await sock.sendMessage(jid, {
                text:
                    '❌ Não consegui promover o usuário.'
            });
        }
    }
};