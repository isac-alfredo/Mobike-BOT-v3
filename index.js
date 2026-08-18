const connectToWhatsApp = require('./src/connection');
const { loadCommands } = require('./src/lib/loader');
const { getGroupAdmins } = require('./src/lib/utils');
const db = require('./src/database/db'); // Agora usando a versão MongoDB
const config = require('./config');
const fs = require('fs');
const path = require('path');

// Map para rastrear spam em tempo real (em memória)
const spamTracker = new Map();

// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

function cleanNumber(value) {
    return String(value || '').split('@')[0].replace(/\D/g, '');
}

function getParticipantPhone(participant) {
    if (!participant) return '';
    if (typeof participant === 'object') {
        if (participant.phoneNumber) return cleanNumber(participant.phoneNumber);
        if (participant.id) {
            const id = String(participant.id);
            if (id.endsWith('@s.whatsapp.net')) return cleanNumber(id);
        }
    }
    if (typeof participant === 'string') {
        if (participant.endsWith('@s.whatsapp.net')) return cleanNumber(participant);
    }
    return '';
}

function getParticipantId(participant) {
    if (!participant) return '';
    if (typeof participant === 'string') return participant;
    if (typeof participant === 'object') {
        return String(participant.id || participant.jid || '');
    }
    return '';
}

// =====================================================
// FUNÇÃO PRINCIPAL
// =====================================================

async function start() {
    console.log(`--- 🤖 [${config.botName}] INICIANDO ---`);

    const sock = await connectToWhatsApp();
    let commands = loadCommands();

    // =====================================================
    // 1. MONITOR DE MENSAGENS (COMANDOS E MODERAÇÃO)
    // =====================================================

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        try {
            if (type !== 'notify') return;
            const msg = messages[0];
            if (!msg || !msg.message) return;

            const jid = msg.key.remoteJid;
            if (!jid) return;

            const isGroup = jid.endsWith('@g.us');
            const sender = msg.key.participant || msg.key.remoteJid;
            const pushName = msg.pushName || 'Usuário';

            const body = (
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text ||
                msg.message.imageMessage?.caption ||
                msg.message.videoMessage?.caption ||
                ''
            ).trim();

            // Identificação do Dono e Remetente
            const ownerNumber = cleanNumber(config.owner);
            const senderNumber = cleanNumber(sender);
            const isOwner = (!!ownerNumber && senderNumber === ownerNumber) || msg.key.fromMe;

            // Filtros iniciais
            if (msg.key.fromMe && !body.startsWith(config.prefix)) return;
            if (!body && !msg.message.imageMessage) return;

            let isAdmin = false;
            let groupConfig = null;

            if (isGroup) {
                // CHAMADA MONGODB (AWAIT)
                groupConfig = await db.getGroup(jid); 
                try {
                    const groupAdmins = await getGroupAdmins(sock, jid);
                    isAdmin = groupAdmins.some(admin => admin === sender || cleanNumber(admin) === senderNumber);
                } catch (error) {
                    console.log('⚠️ Erro ao verificar ADM:', error.message);
                }
            }

            // =================================================
            // SISTEMA DE MODERAÇÃO (APENAS PARA MEMBROS)
            // =================================================
            if (isGroup && !isOwner && !isAdmin) {

                // --- 🔇 MUTE (Atenção: No MongoDB Map usa-se .get()) ---
                if (groupConfig?.mute?.get(sender)) {
                    try { await sock.sendMessage(jid, { delete: msg.key }); } catch (e) {}
                    return;
                }

                // --- 🛡️ ANTI-SPAM (FLOOD) ---
                if (groupConfig?.antiSpam) {
                    const now = Date.now();
                    const userData = spamTracker.get(sender) || { lastMsg: 0, count: 0 };
                    
                    if (now - userData.lastMsg < 2500) userData.count += 1;
                    else userData.count = 1;

                    userData.lastMsg = now;
                    spamTracker.set(sender, userData);

                    if (userData.count > 5) {
                        try { await sock.sendMessage(jid, { delete: msg.key }); } catch (e) {}
                        if (userData.count === 6) { 
                            const currentWarns = await db.addWarn(jid, sender); // AWAIT AQUI
                            const limit = groupConfig.warnLimit || 3;
                            if (currentWarns >= limit) {
                                await sock.sendMessage(jid, { text: `🚨 @${senderNumber} banido por excesso de Spam!`, mentions: [sender] });
                                await sock.groupParticipantsUpdate(jid, [sender], 'remove');
                                await db.resetWarns(jid, sender); // AWAIT AQUI
                            } else {
                                await sock.sendMessage(jid, { text: `⚠️ @${senderNumber}, pare de fazer Spam! [${currentWarns}/${limit}]`, mentions: [sender] });
                            }
                        }
                        return;
                    }
                }

                // --- 🛡️ ANTI-FOTO ---
                const isFoto = 
                    msg.message?.imageMessage || 
                    msg.message?.viewOnceMessageV2?.message?.imageMessage || 
                    msg.message?.viewOnceMessage?.message?.imageMessage ||
                    msg.message?.ephemeralMessage?.message?.imageMessage ||
                    msg.message?.documentWithCaptionMessage?.message?.imageMessage;

                if (groupConfig?.antiFoto && isFoto) {
                    try { await sock.sendMessage(jid, { delete: msg.key }); } catch (e) {}
                    const currentWarns = await db.addWarn(jid, sender); // AWAIT AQUI
                    const limit = groupConfig.warnLimit || 3;
                    if (currentWarns >= limit) {
                        await sock.sendMessage(jid, { text: `🚨 @${senderNumber} banido por enviar foto!`, mentions: [sender] });
                        await sock.groupParticipantsUpdate(jid, [sender], 'remove');
                        await db.resetWarns(jid, sender); // AWAIT AQUI
                    } else {
                        await sock.sendMessage(jid, { text: `⚠️ @${senderNumber}, fotos são proibidas! [${currentWarns}/${limit}]`, mentions: [sender] });
                    }
                    return; 
                }

                // --- 🛡️ ANTI-LINK ---
                if (groupConfig?.antilink) {
                    const anyLinkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.[a-z]{2,}(\/[^\s]*)?)/gi;
                    if (anyLinkRegex.test(body)) {
                        try { await sock.sendMessage(jid, { delete: msg.key }); } catch (e) {}
                        const currentWarns = await db.addWarn(jid, sender); // AWAIT AQUI
                        const limit = groupConfig.warnLimit || 3;
                        if (currentWarns >= limit) {
                            await sock.sendMessage(jid, { text: `🚨 @${senderNumber} banido por enviar links!`, mentions: [sender] });
                            await sock.groupParticipantsUpdate(jid, [sender], 'remove');
                            await db.resetWarns(jid, sender); // AWAIT AQUI
                        } else {
                            await sock.sendMessage(jid, { text: `⚠️ @${senderNumber}, links são proibidos! [${currentWarns}/${limit}]`, mentions: [sender] });
                        }
                        return;
                    }
                }
            }

            // =================================================
            // PROCESSAMENTO DE COMANDOS
            // =================================================
            if (!body.startsWith(config.prefix)) return;

            const args = body.slice(config.prefix.length).trim().split(/\s+/);
            const commandName = args.shift()?.toLowerCase();
            if (!commandName) return;

            const command = commands.get(commandName);

            if (command) {
                // TRAVA DE DONO
                if (command.ownerOnly && !isOwner) {
                    return await sock.sendMessage(jid, { text: `❌ Comando restrito ao Proprietário ${config.ownerName}.` });
                }

                // TRAVA DE ADM
                if (command.adminOnly && isGroup && !isAdmin && !isOwner) {
                    return await sock.sendMessage(jid, { text: '❌ Apenas administradores podem usar este comando.' });
                }

                try {
                    // Nota: Seus comandos também devem ser atualizados para serem async e usarem await no db
                    await command.execute(sock, msg, args, commands);
                } catch (error) {
                    console.error(`❌ Erro no comando ${commandName}:`, error);
                }
            }

        } catch (error) {
            console.error('❌ Erro no processamento:', error);
        }
    });

    // =====================================================
    // 2. PARTICIPANTES DO GRUPO (BOAS-VINDAS / ANTI-ESTRANGEIRO)
    // =====================================================

    sock.ev.on('group-participants.update', async (update) => {
        try {
            const { id, participants, action } = update;
            if (!id) return;
            
            // CHAMADA MONGODB (AWAIT)
            const groupConfig = await db.getGroup(id);

            for (const participant of participants) {
                const participantId = getParticipantId(participant);
                const realNumber = getParticipantPhone(participant);
                const displayNumber = realNumber || cleanNumber(participantId);

                // Anti-Estrangeiro (Foco Moçambique 258)
                if (action === 'add' && groupConfig?.antiEstrangeiro && realNumber) {
                    if (!realNumber.startsWith('258')) {
                        await sock.groupParticipantsUpdate(id, [participantId], 'remove');
                        continue;
                    }
                }

                // Boas-Vindas
                if (groupConfig?.welcome && action === 'add') {
                    const metadata = await sock.groupMetadata(id);
                    const groupName = metadata.subject;
                    let welcomeTxt = groupConfig.welcomeMessage || "Olá @user, bem-vindo(a) ao grupo @group!";
                    
                    welcomeTxt = welcomeTxt.replace('@user', `@${displayNumber}`)
                                           .replace('@name', displayNumber)
                                           .replace('@group', groupName)
                                           .replace('@rules', groupConfig.rules || '');

                    if (groupConfig.welcomePhoto) {
                        let ppUrl;
                        try { ppUrl = await sock.profilePictureUrl(participantId, 'image'); } catch (e) {
                            ppUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
                        }
                        await sock.sendMessage(id, { image: { url: ppUrl }, caption: welcomeTxt, mentions: [participantId] });
                    } else {
                        await sock.sendMessage(id, { text: welcomeTxt, mentions: [participantId] });
                    }
                }

                if (groupConfig?.welcome && action === 'remove') {
                    await sock.sendMessage(id, { text: `🚫 O usuário @${displayNumber} saiu do grupo.`, mentions: [participantId] });
                }
            }
        } catch (error) {
            console.error('❌ Erro no evento de participantes:', error);
        }
    });

    // =====================================================
    // 3. HOT RELOAD
    // =====================================================
    const commandsPath = path.join(__dirname, 'src', 'commands');
    if (fs.existsSync(commandsPath)) {
        fs.watch(commandsPath, (eventType, filename) => {
            if (filename?.endsWith('.js')) {
                console.log(`[RELOAD] Comando atualizado: ${filename}`);
                commands = loadCommands();
            }
        });
    }

    console.log(`✅ ${config.botName} está pronto e online com MongoDB Atlas!`);
}

start().catch(err => console.error('❌ Erro fatal:', err));