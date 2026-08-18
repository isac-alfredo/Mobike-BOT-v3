const { getTargetUser } =
    require('../lib/utils');

module.exports = {

    name: 'demote',

    adminOnly: true,

    async execute(sock, msg) {

        const jid = msg.key.remoteJid;

        const target =
            getTargetUser(msg);

        if (!target) {
            return sock.sendMessage(jid, {
                text:
                    '❌ Marque o administrador.'
            });
        }

        try {

            await sock.groupParticipantsUpdate(
                jid,
                [target],
                'demote'
            );

            await sock.sendMessage(jid, {
                text:
                    `⬇️ @${target.split('@')[0]} deixou de ser administrador.`,
                mentions: [target]
            });

        } catch (error) {

            console.error(error);

            await sock.sendMessage(jid, {
                text:
                    '❌ Não consegui remover a administração.'
            });
        }
    }
};