const config = require('../../config');

module.exports = {
    name: 'bc',
    description: 'Transmissão para todos os grupos',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const jid = msg.key.remoteJid;
        const texto = args.join(' ');

        if (!texto) return sock.sendMessage(jid, { text: '⚠️ Digite a mensagem que deseja transmitir.' });

        // Obtém todos os grupos que o bot participa
        const grupos = Object.keys(await sock.groupFetchAllParticipating());

        await sock.sendMessage(jid, { text: `🚀 Iniciando transmissão para ${grupos.length} grupos...` });

        for (let i of grupos) {
            try {
                await sock.sendMessage(i, { 
                    text: `📢 *TRANSMISSÃO OFICIAL*\n\n${texto}\n\n_Enviado pelo Proprietário_` 
                });
            } catch (e) {
                console.log(`Erro ao enviar para o grupo: ${i}`);
            }
        }

        await sock.sendMessage(jid, { text: '✅ Transmissão concluída com sucesso!' });
    }
};