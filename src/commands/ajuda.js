const config = require('../../config');

module.exports = {
    name: 'ajuda',
    description: 'Manual de instruções do bot',
    adminOnly: false,
    execute: async (sock, msg, args) => {
        const texto = `❓ *COMO USAR O ${config.botName.toUpperCase()}*



🛡️* MANUAL DE COMANDOS - MOBIKE BOT* 🇲🇿
Este guia contém todos os comandos disponíveis, divididos por nível de permissão.
*Nota*: Para a maioria dos comandos de moderação, o bot precisa ser Administrador do grupo.

👤 COMANDOS PARA MEMBROS (Público)
Qualquer pessoa no grupo pode usar.

•/menu – Exibe a lista principal de comandos com imagem.

•/ping – Verifica se o bot está online e a velocidade de resposta.

•/adms – Lista todos os administradores do grupo atual.

•/dono – Mostra as informações oficiais do Isac Alfredo (Links e Cartão de Contacto).

•/perfil – Exibe suas informações: foto, nome, número e nível de permissão.

👑 COMANDOS PARA ADMINISTRADORES

Apenas para quem tem o "selo" de ADM no grupo.

🔒 Segurança e Travas Automáticas
•/antilink on/off – Bane automaticamente quem enviar qualquer link (gera aviso).

•/antifoto on/off – Bane quem enviar fotos ou imagens de visualização única (gera aviso).

•/antispam on/off – Detecta e apaga flood de mensagens rápidas (gera aviso).

!antiestrangeiro on/off – Expulsa na hora números que não começam com +258 (Moçambique).

👋 Sistema de Boas-Vindas
•/welcome on/off – Ativa ou desativa a mensagem de saudação.

•/welcomephoto on/off – Define se o bot deve enviar a foto de perfil do novo membro.

•/setwelcome [texto] – Configura a mensagem. Tags aceitas:
@user – Marca o usuário (azul).
@name – Escreve o nome do usuário.
@group – Escreve o nome do grupo.

⚠️ Gestão de Advertências (Warns)
!warn (respondendo a alguém) – Adiciona 1 aviso ao membro.

•/resetwarns (respondendo a alguém) – Zera todos os avisos do membro.

•/setlimit [número] – Define quantos avisos levam ao banimento automático (padrão é 3).

🚫 Moderação e Controle
!ban (marcando ou respondendo) – Remove o membro do grupo (Não afeta ADMs).

•/promote (marcando) – Promove o membro a Administrador.

•/demote (marcando) – Remove o cargo de ADM do membro.

•/mute (marcando) – Faz o bot apagar todas as mensagens daquele usuário.

•/unmute (marcando) – Permite que o usuário volte a falar.

•/fechar – O grupo fica no modo "Apenas Administradores".

!abrir – O grupo volta ao modo "Todos podem falar".

•/grupo – Mostra um resumo de quais travas estão ligadas no momento.


        


💡 *Dica:* Todos os comandos começam com o prefixo *${config.prefix}*`;

        await sock.sendMessage(msg.key.remoteJid, { text: texto }, { quoted: msg });
    }
};