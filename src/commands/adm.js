module.exports = {
    name: 'adm',
    description: 'Exibe o menu de administração do grupo',
    adminOnly: true,

    async execute(sock, msg) {
        const jid = msg.key.remoteJid;
        
        const menuADM = `
╭━━━〔 👑 PAINEL ADM 〕━━━╮

🛡️ *SEGURANÇA (AUTO)*
┃ ➟ /antilink [on/off]
┃ ➟ /antispam [on/off]
┃ ➟ /antifoto [on/off]
┃ ➟ /antiestrangeiro [on/off]
┃ ➟ /antispam [on/off]

👋 *BOAS-VINDAS*
┃ ➟ /welcome [on/off]
┃ ➟ /welcomephoto [on/off]
┃ ➟ /setwelcome [texto]
┃ _Tags: @user, @name, @group_

⚠️ *SISTEMA DE AVISOS*
┃ ➟ /warn [marcar/responder]
┃ ➟ /resetwarns [marcar]
┃ ➟ /setlimit [número]

🚫 *MODERAÇÃO MANUAL*
┃ ➟ /ban [marcar/responder]
┃ ➟ /promote [marcar]
┃ ➟ /demote [marcar]

🔇 *CONTROLE DE CHAT*
┃ ➟ /mute [marcar]
┃ ➟ /unmute [marcar]
┃ ➟ /fechar (Apenas ADMs)
┃ ➟ /abrir (Todos falam)

📊 *UTILITÁRIOS*
┃ ➟ /admins (Lista ADMs)
┃ ➟ /grupo (Dados do grupo)

╰━━━━━━━━━━━━━━━━━━━━╯
🇲🇿 *Mobike Bot - Gestão de Elite*`;

        await sock.sendMessage(jid, {
            text: menuADM
        }, { quoted: msg });
    }
};