const fs = require('fs');
const path = require('path');

const databasePath = path.join(__dirname, 'database.json');

let database = { groups: {} };

// Garante que o ficheiro existe
function ensureDatabase() {
    if (!fs.existsSync(databasePath)) {
        fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));
        return;
    }
    try {
        database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));
    } catch (error) {
        console.error('❌ Erro ao ler database.json:', error);
        database = { groups: {} };
    }
}

function saveDatabase() {
    fs.writeFileSync(databasePath, JSON.stringify(database, null, 2));
}

function getGroup(jid) {
    if (!database.groups[jid]) {
        database.groups[jid] = {
            antilink: false,
            antiEstrangeiro: false,
            antiFoto: false,
            antiSpam: false,
            welcome: false,
            welcomePhoto: false,
            welcomeMessage: 'Olá @user, bem-vindo(a) ao grupo @group!',
            rules: 'As regras deste grupo ainda não foram configuradas.',
            warnLimit: 3,
            warnings: {},
            mute: {}
        };
        saveDatabase();
    }
    return database.groups[jid];
}

function updateGroup(jid, data) {
    const group = getGroup(jid);
    database.groups[jid] = { ...group, ...data };
    saveDatabase();
    return database.groups[jid];
}

function addWarn(jid, user) {
    const group = getGroup(jid);
    group.warnings[user] = (group.warnings[user] || 0) + 1;
    saveDatabase();
    return group.warnings[user];
}

function getWarnings(jid, user) {
    const group = getGroup(jid);
    return group.warnings[user] || 0;
}

function resetWarns(jid, user) {
    const group = getGroup(jid);
    if (group.warnings[user]) {
        delete group.warnings[user];
        saveDatabase();
    }
}

ensureDatabase();

module.exports = { getGroup, updateGroup, addWarn, getWarnings, resetWarns };