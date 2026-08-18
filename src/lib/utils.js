async function getGroupAdmins(sock, jid) {

    const metadata = await sock.groupMetadata(jid);

    return metadata.participants
        .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
        .map(p => p.id);
}


function getMentionedUser(msg) {

    const context =
        msg.message?.extendedTextMessage?.contextInfo;

    if (
        context &&
        Array.isArray(context.mentionedJid) &&
        context.mentionedJid.length > 0
    ) {
        return context.mentionedJid[0];
    }

    return null;
}


function getQuotedUser(msg) {

    const context =
        msg.message?.extendedTextMessage?.contextInfo;

    if (!context?.participant) {
        return null;
    }

    return context.participant;
}


function getTargetUser(msg) {

    return (
        getMentionedUser(msg) ||
        getQuotedUser(msg)
    );
}


function normalizeJid(jid) {

    if (!jid) return '';

    return String(jid);
}


module.exports = {
    getGroupAdmins,
    getMentionedUser,
    getQuotedUser,
    getTargetUser,
    normalizeJid
};