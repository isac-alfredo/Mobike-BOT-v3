const mongoose = require('mongoose');
const config = require('../../config');

// Conexão com MongoDB
mongoose.connect(config.mongoURI)
    .then(() => console.log('✅ Conectado ao MongoDB Atlas (Nuvem)!'))
    .catch((err) => console.error('❌ Erro de conexão MongoDB:', err));

// Esquema do Grupo
const GroupSchema = new mongoose.Schema({
    jid: { type: String, unique: true },
    antilink: { type: Boolean, default: false },
    antiEstrangeiro: { type: Boolean, default: false },
    antiFoto: { type: Boolean, default: false },
    antiSpam: { type: Boolean, default: false },
    welcome: { type: Boolean, default: false },
    welcomePhoto: { type: Boolean, default: false },
    welcomeMessage: { type: String, default: 'Olá @user, bem-vindo(a) ao grupo @group!' },
    rules: { type: String, default: 'As regras deste grupo ainda não foram configuradas.' },
    warnLimit: { type: Number, default: 3 },
    warnings: { type: Map, of: Number, default: {} },
    mute: { type: Map, of: Boolean, default: {} }
});

const Group = mongoose.model('Group', GroupSchema);

module.exports = {
    getGroup: async (jid) => {
        let group = await Group.findOne({ jid });
        if (!group) group = await Group.create({ jid });
        return group;
    },
    updateGroup: async (jid, data) => {
        return await Group.findOneAndUpdate({ jid }, { $set: data }, { new: true, upsert: true });
    },
    addWarn: async (jid, userId) => {
        const group = await Group.findOne({ jid }) || await Group.create({ jid });
        const current = (group.warnings.get(userId) || 0) + 1;
        group.warnings.set(userId, current);
        await group.save();
        return current;
    },
    getWarnings: async (jid, userId) => {
        const group = await Group.findOne({ jid });
        return group ? (group.warnings.get(userId) || 0) : 0;
    },
    resetWarns: async (jid, userId) => {
        const group = await Group.findOne({ jid });
        if (group) {
            group.warnings.delete(userId);
            await group.save();
        }
    }
};