async function execute(sock, msg) {

    const jid = msg.key.remoteJid;

    if (!jid || !jid.endsWith('@g.us')) {
        return;
    }

    const context =
        msg.message?.extendedTextMessage?.contextInfo;

    const quotedStanzaId =
        context?.stanzaId;

    const quotedParticipant =
        context?.participant;

    if (!quotedStanzaId) {
        return sock.sendMessage(jid, {
            text:
                '❌ Responda à mensagem que deseja apagar usando *!del*.'
        });
    }

    try {

        // =========================================
        // 1. APAGAR A MENSAGEM RESPONDIDA
        // =========================================

        await sock.sendMessage(jid, {
            delete: {
                remoteJid: jid,
                fromMe: false,
                id: quotedStanzaId,
                participant: quotedParticipant
            }
        });


        // =========================================
        // 2. APAGAR O PRÓPRIO !DEL
        // =========================================

        await sock.sendMessage(jid, {
            delete: msg.key
        });

    } catch (error) {

        console.error(
            '❌ Erro ao apagar mensagens:',
            error
        );

        // Se não conseguir apagar alguma das mensagens,
        // não enviamos outra mensagem para não poluir o grupo.
    }
}

module.exports = {
    name: 'del',
    adminOnly: true,
    execute
};