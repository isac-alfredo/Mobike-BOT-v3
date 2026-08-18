const db = require('../database/db');
const config = require('../../config');

module.exports = {
    name: 'perfil',
    description: 'Exibe o perfil do usuário e seu status de advertências',
    adminOnly: false,

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const isGroup = jid.endsWith('@g.us');

        // 1. Identificar quem é o alvo (quem foi marcado, quem foi respondido ou quem enviou o comando)
        const quoted = msg.message.extendedTextMessage?.contextInfo?.participant;
        const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const target = mentioned || quoted || (msg.key.participant || msg.key.remoteJid);

        // 2. Coletar dados básicos
        const targetNumber = target.split('@')[0];
        const pushName = (target === (msg.key.participant || msg.key.remoteJid)) ? (msg.pushName || 'Usuário') : 'Usuário';

        // 3. Verificar Patente (Dono, ADM ou Membro)
        let patente = 'Membro';
        const ownerPure = config.owner.replace(/\D/g, '');
        
        if (target.includes(ownerPure)) {
            patente = 'Proprietário 👑';
        } else if (isGroup) {
            const metadata = await sock.groupMetadata(jid);
            const participant = metadata.participants.find(p => p.id === target);
            if (participant?.admin) {
                patente = 'Administrador 🛡️';
            }
        }

        // 4. Buscar Advertências no Banco de Dados
        const warnings = db.getWarnings(jid, target);
        const groupConfig = db.getGroup(jid);
        const limit = groupConfig.warnLimit || 3;

        // 5. Tentar obter a foto de perfil
        let ppUrl;
        try {
            ppUrl = await sock.profilePictureUrl(target, 'image');
        } catch (e) {
            // Foto padrão caso a privacidade do usuário bloqueie
            ppUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        }

        // 6. Montar o texto do perfil
        const textoPerfil = `
╔════════════════════╗
   👤 *PERFIL DO USUÁRIO*
╚════════════════════╝

📝 *Nome:* ${pushName}
📱 *Número:* ${targetNumber}
🎖️ *Patente:* ${patente}

⚠️ *SISTEMA DE AVISOS*
┝ 🚩 Advertências: [ ${warnings} / ${limit} ]
┝ 📊 Status: ${warnings >= limit - 1 ? '🔴 Risco de Ban' : '🟢 Regular'}

╚════════════════════╝
_MOBIKE BOT - GESTÃO ELITE_ 🇲🇿`;

        // 7. Enviar o perfil com a foto
        try {
            await sock.sendMessage(jid, {
                image: { url: ppUrl },
                caption: textoPerfil,
                mentions: [target]
            }, { quoted: msg });
        } catch (error) {
            // Se falhar o envio da imagem, envia apenas texto
            await sock.sendMessage(jid, { text: textoPerfil, mentions: [target] }, { quoted: msg });
        }
    }
};