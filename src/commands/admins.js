const {
    getGroupAdmins
} = require('../lib/utils');

module.exports = {

    name: 'admins',

    adminOnly: false,

    async execute(sock, msg) {

        const jid =
            msg.key.remoteJid;

        const metadata =
            await sock.groupMetadata(jid);

        const admins =
            metadata.participants
                .filter(
                    p =>
                        p.admin === 'admin' ||
                        p.admin === 'superadmin'
                );

        let texto =
            '👑 *ADMINISTRADORES DO GRUPO*\n\n';

        for (const admin of admins) {

            texto +=
                `• @${admin.id.split('@')[0]}\n`;

        }

        await sock.sendMessage(jid, {

            text: texto,

            mentions:
                admins.map(a => a.id)

        });
    }
};