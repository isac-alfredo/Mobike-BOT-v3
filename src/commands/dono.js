const config = require('../../config');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'dono',
    description: 'Exibe as informações oficiais do proprietário',
    adminOnly: false,

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const ownerId = config.owner.split('@')[0];
        const caminhoImagem = path.join(process.cwd(), 'assets', 'dono.jpg');

        // 1. Criar o VCard (Cartão de Contacto)
        // Adicionamos o seu Instagram como a URL principal no cartão
        const vcard = 'BEGIN:VCARD\n'
            + 'VERSION:3.0\n'
            + `FN:${config.ownerName}\n`
            + `ORG:${config.botName};\n`
            + `TEL;type=CELL;type=VOICE;waid=${ownerId}:+${ownerId}\n`
            + `URL;type=Instagram:${config.instagram}\n`
            + `NOTE:Dono do Mobike Bot - Moçambique\n`
            + 'END:VCARD';

        // 2. Formatação do Texto com seus links
        const textoDono = `
╔════════════════════╗
   👑 *PROPRIETÁRIO DO BOT* 👑
╚════════════════════╝

👤 *Nome:* ${config.ownerName}
🇲🇿 *Origem:* Moçambique

🌐 *REDES SOCIAIS:*
✈️ *Telegram:* ${config.telegram}
📺 *YouTube:* ${config.youtube}
📸 *Instagram:* ${config.instagram}

📱 *WhatsApp:* wa.me/${ownerId}

*~_Clique no contacto abaixo para salvar o meu contacto e acompanhar as novidades no YouTube!_~*
`;

        try {
            // Tenta enviar a imagem 'dono.jpg' na pasta assets
            let fotoParaEnviar = caminhoImagem;
            if (!fs.existsSync(caminhoImagem)) {
                fotoParaEnviar = path.join(process.cwd(), 'assets', 'menu.jpg');
            }

            if (fs.existsSync(fotoParaEnviar)) {
                await sock.sendMessage(jid, {
                    image: fs.readFileSync(fotoParaEnviar),
                    caption: textoDono
                }, { quoted: msg });
            } else {
                await sock.sendMessage(jid, { text: textoDono }, { quoted: msg });
            }

            // 3. Enviar o Cartão de Contacto logo após a imagem
            await sock.sendMessage(jid, {
                contacts: {
                    displayName: config.ownerName,
                    contacts: [{ vcard }]
                }
            }, { quoted: msg });

        } catch (error) {
            console.error("Erro ao enviar informações do dono:", error);
            await sock.sendMessage(jid, { text: "❌ Erro ao exibir informações do proprietário." });
        }
    }
};