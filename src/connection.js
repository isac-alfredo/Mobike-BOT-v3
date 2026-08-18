const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion,
    PHONENUMBER_MCC 
} = require('@whiskeysockets/baileys');
const P = require('pino');
const readline = require('readline');

// Configuração para ler entrada do terminal
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: P({ level: 'silent' }),
        printQRInTerminal: false, // Desativado para usar código
        auth: state,
        browser: ["Ubuntu", "Chrome", "20.0.04"], // Necessário para pareamento por código
    });

    // --- LÓGICA DO PAIRING CODE ---
    if (!sock.authState.creds.registered) {
        console.log("--- CONEXÃO POR NÚMERO ---");
        const phoneNumber = await question('Digite o número do bot (Ex: 5511999999999): ');
        
        // Remove espaços e caracteres especiais
        const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
        
        setTimeout(async () => {
            let code = await sock.requestPairingCode(cleanNumber);
            code = code?.match(/.{1,4}/g)?.join("-") || code;
            console.log(`\n👉 SEU CÓDIGO DE ACESSO: ${code}\n`);
            console.log("Abra seu WhatsApp > Aparelhos Conectados > Conectar um aparelho > Conectar com número de telefone.\n");
        }, 3000); // Delay de segurança
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) connectToWhatsApp();
        } else if (connection === 'open') {
            console.log('✅ Mobike Bot conectado via Código!');
        }
    });

    return sock;
}

module.exports = connectToWhatsApp;