const db = require('../database/db');

module.exports = {
    name: 'welcomephoto',
    description: 'Ativa ou desativa a foto de perfil no boas-vindas',
    adminOnly: true,
    execute: async (sock, msg, args) => {
        const jid = msg.key.remoteJid;
        const op = args[0]?.toLowerCase();

        if (op === 'on') {
            db.updateGroup(jid, { welcomePhoto: true });
            await sock.sendMessage(jid, { text: '✅ Agora as boas-vindas incluirão a foto de perfil do membro!' });
        } else if (op === 'off') {
            db.updateGroup(jid, { welcomePhoto: false });
            await sock.sendMessage(jid, { text: '❌ Foto de perfil desativada. As boas-vindas serão apenas texto.' });
        } else {
            await sock.sendMessage(jid, { text: '❓ Use: *!welcomephoto on* ou *off*' });
        }
    }
};