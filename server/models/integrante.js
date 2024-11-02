const mongoose = require('mongoose');

const integranteSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    dataNascimento: { type: Date, required: true },
    telefone: { type: String, required: true },
    casado: { type: String, enum: ['sim', 'nao'], required: true },
    batizado: { type: String, enum: ['sim', 'nao'], required: true },
    ministerio: { type: String, enum: ['nao', 'voluntarios', 'louvor', 'danca', 'tecnico', 'midia'], required: true }
});

module.exports = mongoose.model('Integrante', integranteSchema);
