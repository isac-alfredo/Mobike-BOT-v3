const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion 
} = require('@whiskeysockets/baileys');
const P = require('pino');
const config = require('../config');
const { MongoAuthState } = require('wa-mongodb-helper'); // Nova biblioteca

async function connectToWhatsApp() {
    // --- AGORA A SESSÃO É SALVA NO MONGODB ---
    const authState = await MongoAuthState(config.mongoURI, 'sessao_bot');
    const { state, saveCreds } = authState;
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
    });

    if (!sock.authState.creds.registered) {
        const phoneNumber = config.owner.replace(/[^0-9]/g, '');
        console.log(`📡 Solicitando código para: ${phoneNumber}`);
        
        setTimeout(async () => {
            try {
                let code = await sock.requestPairingCode(phoneNumber);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log(`\n✅ SEU CÓDIGO DE ACESSO: ${code}\n`);
            } catch (error) {
                console.error("Erro ao pedir código:", error.message);
            }
        }, 5000);
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) connectToWhatsApp();
        } else if (connection === 'open') {
            console.log('✅ CONECTADO E SESSÃO SALVA NO MONGODB!');
        }
    });

    return sock;
}

module.exports = connectToWhatsApp;