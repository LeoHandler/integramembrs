const express = require('express');
const router = express.Router();
const Integrante = require('./models/integrante');

// Rota para buscar todos os integrantes
router.get('/integrantes', async (req, res) => {
    try {
        const integrantes = await Integrante.find();
        res.json(integrantes);
    } catch (error) {
        console.error('Erro ao buscar integrantes:', error);
        res.status(500).json({ error: 'Falha ao buscar integrantes' });
    }
});

// Rota para adicionar um novo integrante
router.post('/integrantes', async (req, res) => {
    try {
        const { nome, cpf, dataNascimento, telefone, casado, batizado, ministerio } = req.body;

        // Verificar se o CPF já existe
        const existingIntegrante = await Integrante.findOne({ cpf });
        if (existingIntegrante) {
            return res.status(400).json({ error: 'CPF já cadastrado' });
        }

        const newIntegrante = new Integrante({ nome, cpf, dataNascimento, telefone, casado, batizado, ministerio });
        await newIntegrante.save();
        res.status(201).json(newIntegrante);
    } catch (error) {
        console.error('Erro ao adicionar integrante:', error);
        res.status(500).json({ error: 'Falha ao adicionar integrante' });
    }
});

// Rota para editar um integrante por ID
router.put('/integrantes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        // Atualizar o integrante no banco de dados
        const integrante = await Integrante.findByIdAndUpdate(id, updatedData, { new: true });
        if (!integrante) {
            return res.status(404).json({ error: 'Integrante não encontrado' });
        }
        res.status(200).json(integrante);
    } catch (error) {
        console.error('Erro ao atualizar integrante:', error);
        res.status(500).json({ error: 'Falha ao atualizar integrante' });
    }
});

// Rota para deletar um integrante por ID
router.delete('/integrantes/:id', async (req, res) => {
    try {
        await Integrante.findByIdAndDelete(req.params.id);
        res.json({ message: 'Integrante removido com sucesso' });
    } catch (error) {
        console.error('Erro ao remover integrante:', error);
        res.status(500).json({ error: 'Falha ao remover integrante' });
    }
});

module.exports = router;
