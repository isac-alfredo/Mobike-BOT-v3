const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion 
} = require('@whiskeysockets/baileys');
const P = require('pino');
const config = require('../config');

async function connectToWhatsApp() {
    // Pasta da sessão
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: P({ level: 'silent' }),
        printQRInTerminal: false, // Não imprime QR, vamos usar código
        auth: state,
        // Browser necessário para servidores
        browser: ["Ubuntu", "Chrome", "20.0.04"], 
    });

    // --- PAREAMENTO AUTOMÁTICO (SEM READLINE) ---
    if (!sock.authState.creds.registered) {
        // Pega o número do dono no config.js
        const phoneNumber = config.owner.replace(/[^0-9]/g, '');

        if (!phoneNumber) {
            console.error("❌ ERRO: O número do dono não foi configurado no config.js");
        } else {
            console.log(`📡 Solicitando código de pareamento para: ${phoneNumber}`);
            
            // Aguarda 5 segundos para o servidor estabilizar
            setTimeout(async () => {
                try {
                    let code = await sock.requestPairingCode(phoneNumber);
                    code = code?.match(/.{1,4}/g)?.join("-") || code;
                    console.log(`\n✅ SEU CÓDIGO DE ACESSO: ${code}\n`);
                } catch (error) {
                    console.error("❌ Erro ao pedir código:", error.message);
                }
            }, 5000);
        }
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) connectToWhatsApp();
        } else if (connection === 'open') {
            console.log('✅ MOBIKE-BOT CONECTADO NA NUVEM!');
        }
    });

    return sock;
}

module.exports = connectToWhatsApp;