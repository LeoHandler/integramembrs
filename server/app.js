// server/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/igreja', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado ao MongoDB');
}).catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rotas da API
app.use('/api', routes);

// Redireciona para a página inicial
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
