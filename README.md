# 🛡️ MOBIKE-BOT ADM 🇲🇿

O **Mobike Bot** é um sistema de administração e automação para WhatsApp ultra-eficiente, focado em segurança de grupos e gestão de comunidades. Desenvolvido especialmente para o cenário de Moçambique, com suporte total a bancos de dados na nuvem (**MongoDB Atlas**).

---

## 🚀 Funcionalidades Principais

### 🛡️ Segurança e Moderação Automática
- **Anti-Link:** Bloqueia e pune o envio de links de outros grupos.
- **Anti-Foto:** Controle total sobre mídias enviadas por membros.
- **Anti-Spam/Flood:** Detecta mensagens rápidas e aplica avisos automáticos.
- **Anti-Estrangeiro:** Sistema exclusivo que remove números fora do DDI **+258 (Moçambique)**.
- **Sistema de Warns:** Advertências progressivas com banimento automático após atingir o limite.

### 👋 Interação e Gestão
- **Boas-Vindas Dinâmico:** Mensagens personalizadas com foto de perfil do membro e nome do grupo.
- **Regras Individuais:** Cada grupo pode configurar o seu próprio livro de regras.
- **Mute/Unmute:** Silencie membros específicos ou feche o grupo totalmente.
- **Painel ADM:** Menu intuitivo para gerenciar todas as travas do bot.

---

## 🛠️ Tecnologias Utilizadas

*   [Node.js](https://nodejs.org/)
*   [Baileys (v7)](https://github.com/WhiskeySockets/Baileys)
*   [MongoDB Atlas](https://www.mongodb.com/) (Persistência de dados na nuvem)
*   [Mongoose](https://mongoosejs.com/)

---

## 📦 Instalação Local (Termux/PC)

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/SEU_USUARIO/mobike-bot.git
    cd mobike-bot
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure o arquivo `config.js`:**
    - Insira seu número de dono.
    - Insira a sua `mongoURI` do MongoDB Atlas.

4.  **Inicie o bot:**
    ```bash
    bash start.sh
    ```

---

## ☁️ Hospedagem (Koyeb / Heroku)

Este bot está pronto para ser hospedado em plataformas de nuvem. 
Certifique-se de configurar a variável de ambiente:
- `MONGO_URI`: Sua URL de conexão do MongoDB.

Para manter o bot 24h no **Koyeb**, conecte seu GitHub, use o comando de build `npm install` e o comando de execução `node index.js`.

---

## 👑 Comandos Úteis

| Comando | Descrição | Permissão |
| :--- | :--- | :--- |
| `!menu` | Lista geral de comandos | Todos |
| `!perfil` | Mostra dados e avisos do usuário | Todos |
| `!adm` | Painel de controle do grupo | ADM |
| `!antilink on/off`| Ativa trava de links | ADM |
| `!setwelcome` | Define saudação personalizada | ADM |
| `!dono` | Informações do desenvolvedor | Todos |
| `!bc` | Transmissão para todos os grupos | Dono |

---

## 👨‍💻 Desenvolvedor

**Isac Alfredo** 🇲🇿
- **YouTube:** [Mobike Moz](https://youtube.com/@mobikemoz6407?si=k4DADj67tuqyWYdH)
- **Telegram:** [@isacalfredo39](https://t.me/isacalfredo39)
- **Instagram:** [@isac_alfredo_](https://www.instagram.com/isac_alfredo_?igsh=NGdoMDNyOWh4Mndi)

---
*Este projeto é software livre. Sinta-se à vontade para contribuir!*