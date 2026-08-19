const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion 
} = require('@whiskeysockets/baileys');
const P = require('pino');
const config = require('../config');

async function connectToWhatsApp() {
    // SESSÃO LOCAL NA PASTA auth_info
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ["Mobike Bot", "Chrome", "1.0.0"],
    });

    if (!sock.authState.creds.registered) {
        const phoneNumber = config.owner.replace(/[^0-9]/g, '');
        console.log(`📡 Gerando código para: ${phoneNumber}`);
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
            console.log('✅ BOT CONECTADO LOCALMENTE!');
        }
    });

    return sock;
}

module.exports = connectToWhatsApp;