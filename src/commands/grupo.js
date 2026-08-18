const db = require('../database/db');

module.exports = {
    name: 'grupo',
    description: 'Exibe o status das configurações atuais do grupo',
    adminOnly: true,

    async execute(sock, msg) {
        const jid = msg.key.remoteJid;
        const config = db.getGroup(jid);

        // Formatação do status para cada funcionalidade
        const texto = `
╭━━━〔 ⚙️ CONFIGURAÇÕES 〕━━━╮

🛡️ *SEGURANÇA*
┃ 🔗 Anti-link: ${config.antilink ? '✅' : '❌'}
┃ 🛡️ Anti-spam: ${config.antiSpam ? '✅' : '❌'}
┃ 📸 Anti-foto: ${config.antiFoto ? '✅' : '❌'}
┃ 🇲🇿 Anti-estrangeiro: ${config.antiEstrangeiro ? '✅' : '❌'}

👋 *BOAS-VINDAS*
┃ 👋 Status: ${config.welcome ? '✅' : '❌'}
┃ 🖼️ Foto de Perfil: ${config.welcomePhoto ? '✅' : '❌'}

⚠️ *SISTEMA DE AVISOS*
┃ 📊 Limite de Warns: [ ${config.warnLimit || 3} ]
┃ 📉 Avisos ativos: ${Object.keys(config.warnings || {}).length} membros

╰━━━━━━━━━━━━━━━━━━━━╯
_Para alterar, use o comando correspondente._
`;

        await sock.sendMessage(jid, {
            text: texto
        }, { quoted: msg });
    }
};