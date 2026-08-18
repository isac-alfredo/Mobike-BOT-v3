const fs = require('fs');
const path = require('path');
const config = require('../../config');

module.exports = {
    name: 'menu',
    description: 'Menu inteligente com separação de comandos',
    adminOnly: false,

    async execute(sock, msg, args, commands) {
        const jid = msg.key.remoteJid;
        const pushName = msg.pushName || 'Usuário';

        // 1. Caminho da Imagem
        const caminhoImagem = path.join(process.cwd(), 'assets', 'menu.jpg');

        // 2. Organizar comandos por categoria
        let comandosMembros = '';
        let comandosAdmin = '';

        // Percorre todos os comandos carregados
        commands.forEach((cmd) => {
            if (cmd.adminOnly) {
                comandosAdmin += `┝ ➟ *${config.prefix}${cmd.name}*\n`;
            } else {
                comandosMembros += `┝ ➟ *${config.prefix}${cmd.name}*\n`;
            }
        });

        // 3. Montar o texto final
        const textoMenu = `╔════════════════════╗
  🛡️ *${config.botName.toUpperCase()}* 🛡️
╚════════════════════╝
   _Gestão de Elite_ 🇲🇿

Olá, *${pushName}*! Veja minhas funções:

👤 *MEMBROS*
${comandosMembros || '┝ ➟ Sem comandos listados'}
👑 *ADMINISTRAÇÃO*
${comandosAdmin || '┝ ➟ Sem comandos listados'}

🛡️ *STATUS ATUAL*
┝ Anti-Link: ✅
┝ Anti-Spam: ✅
┝ Anti-Foto: ✅
╚════════════════════╝
_Use o prefixo [ ${config.prefix} ] antes de cada comando._`;

        try {
            if (fs.existsSync(caminhoImagem)) {
                await sock.sendMessage(jid, {
                    image: fs.readFileSync(caminhoImagem),
                    caption: textoMenu,
                    mentions: [msg.key.participant || jid]
                }, { quoted: msg });
            } else {
                await sock.sendMessage(jid, { text: textoMenu }, { quoted: msg });
                console.log("⚠️ Imagem não encontrada, enviando apenas texto.");
            }
        } catch (error) {
            console.error("❌ Erro ao enviar menu:", error);
            await sock.sendMessage(jid, { text: textoMenu });
        }
    }
};