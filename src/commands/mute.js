const db = require('../database/db');

const {
    getTargetUser
} = require('../lib/utils');


module.exports = {

    name: 'mute',

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
                    '❌ Marque o usuário que deseja silenciar.'
            });

        }


        // Verificar se já está mutado

        if (
            db.isMuted(
                jid,
                target
            )
        ) {

            return sock.sendMessage(jid, {

                text:
                    `⚠️ @${target.split('@')[0]} já está mutado.`,

                mentions: [target]

            });

        }


        // Salvar mute

        db.muteUser(
            jid,
            target
        );


        await sock.sendMessage(jid, {

            text:
                `🔇 @${target.split('@')[0]} foi silenciado pelo bot.`,

            mentions: [target]

        });


        console.log(
            `🔇 MUTE: ${target} no grupo ${jid}`
        );

    }

};