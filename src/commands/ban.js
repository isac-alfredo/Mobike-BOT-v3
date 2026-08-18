const { getTargetUser } = require('../lib/utils');

async function execute(sock, msg) {

    const jid = msg.key.remoteJid;

    // Só funciona em grupos
    if (!jid || !jid.endsWith('@g.us')) {
        return sock.sendMessage(jid, {
            text: '❌ Este comando só pode ser usado em grupos.'
        });
    }

    const target = getTargetUser(msg);

    if (!target) {
        return sock.sendMessage(jid, {
            text:
                '❌ Marque o usuário ou responda à mensagem dele.'
        });
    }

    try {

        // =========================================
        // PEGAR INFORMAÇÕES DO GRUPO
        // =========================================

        const metadata = await sock.groupMetadata(jid);

        const targetParticipant =
            metadata.participants.find(
                p => p.id === target
            );

        if (!targetParticipant) {
            return sock.sendMessage(jid, {
                text: '❌ Usuário não encontrado no grupo.'
            });
        }

        // =========================================
        // VERIFICAR SE É ADMINISTRADOR
        // =========================================

        const targetIsAdmin =
            targetParticipant.admin === 'admin' ||
            targetParticipant.admin === 'superadmin';

        if (targetIsAdmin) {

            return sock.sendMessage(jid, {
                text:
                    `🛡️ @${target.split('@')[0]} é administrador.\n\n❌ Administradores não podem ser banidos com este comando.`,
                mentions: [target]
            });

        }

        // =========================================
        // REMOVER USUÁRIO
        // =========================================

        await sock.groupParticipantsUpdate(
            jid,
            [target],
            'remove'
        );

        // =========================================
        // CONFIRMAÇÃO
        // =========================================

        await sock.sendMessage(jid, {
            text:
                `🚫 @${target.split('@')[0]} foi removido do grupo.`,
            mentions: [target]
        });

    } catch (error) {

        console.error(
            '❌ Erro no comando ban:',
            error
        );

        await sock.sendMessage(jid, {
            text:
                '❌ Não consegui remover esse usuário. Verifique se o bot é administrador e se possui permissão para remover membros.'
        });
    }
}

module.exports = {
    name: 'ban',
    adminOnly: true,
    execute
};