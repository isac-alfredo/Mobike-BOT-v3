const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion 
} = require('@whiskeysockets/baileys');
const P = require('pino');
const config = require('../config');

async function connectToWhatsApp() {
    // 1. Inicia a sessão local
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        // Browser é fundamental para o código de pareamento ser aceito
        browser: ["Ubuntu", "Chrome", "20.0.04"], 
    });

    // 2. Lógica de Geração do Código
    if (!sock.authState.creds.registered) {
        const phoneNumber = config.owner.replace(/[^0-9]/g, '');
        
        if (!phoneNumber) {
            console.log("❌ ERRO: Número de telefone não encontrado no config.js");
        } else {
            console.log(`📡 Solicitando código para: ${phoneNumber}...`);
            
            setTimeout(async () => {
                try {
                    let code = await sock.requestPairingCode(phoneNumber);
                    code = code?.match(/.{1,4}/g)?.join("-") || code;
                    console.log(`\n\x1b[32m✅ SEU CÓDIGO DE ACESSO: ${code}\x1b[0m\n`);
                } catch (error) {
                    console.error("❌ Erro ao solicitar código:", error.message);
                    console.log("Dica: Verifique se o número está correto e se o WhatsApp não bloqueou solicitações temporariamente.");
                }
            }, 5000); // 5 segundos de espera
        }
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('🔄 Conexão fechada. Tentando reconectar:', shouldReconnect);
            if (shouldReconnect) connectToWhatsApp();
        } else if (connection === 'open') {
            console.log('\n\x1b[32m✅ BOT CONECTADO COM SUCESSO!\x1b[0m\n');
        }
    });

    return sock;
}

module.exports = connectToWhatsApp;