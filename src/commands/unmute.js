const db = require('../database/db');

const {
    getTargetUser
} = require('../lib/utils');


module.exports = {

    name: 'unmute',

    adminOnly: true,

    async execute(sock, msg) {

        const jid =
            msg.key.remoteJid;


        if (!jid.endsWith('@g.us')) {

            return sock.sendMessage(jid, {
                text:
                    '❌ Este comando só pode ser usado em grupos.'
            });

        }


        const target =
            getTargetUser(msg);


        if (!target) {

            return sock.sendMessage(jid, {
                text:
                    '❌ Marque o usuário que deseja desmutar.'
            });

        }


        if (
            !db.isMuted(
                jid,
                target
            )
        ) {

            return sock.sendMessage(jid, {

                text:
                    `⚠️ @${target.split('@')[0]} não está mutado.`,

                mentions: [target]

            });

        }


        db.unmuteUser(
            jid,
            target
        );


        await sock.sendMessage(jid, {

            text:
                `🔊 @${target.split('@')[0]} foi desmutado.`,

            mentions: [target]

        });


        console.log(
            `🔊 UNMUTE: ${target} no grupo ${jid}`
        );

    }

};