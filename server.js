const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

// Atualizando as credenciais do banco de dados
const pool = new Pool({
    user: 'dev_Look233',
    host: 'localhost',
    database: 'site_eventos',
    password: 'Adm@2022#', // Substitua pela senha correta
    port: 5432,
});

// Middleware para processar JSON
app.use(express.json());

// Configurando CORS para permitir conexões de qualquer origem
app.use(cors({
    origin: '*', // Permite conexões de qualquer origem
    methods: ['GET', 'POST'], // Permite apenas métodos GET e POST
    allowedHeaders: ['Content-Type'], // Permite cabeçalhos específicos
}));

// Middleware para registrar todas as requisições recebidas
app.use((req, res, next) => {
    console.log(`Requisição recebida: ${req.method} ${req.url} de ${req.ip}`);
    next();
});

// Servindo arquivos estáticos da pasta atual
app.use(express.static(path.join(__dirname)));

// Rota para servir o arquivo index.html como página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint de teste de conexão
app.get('/api/teste', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: 'Conexão bem-sucedida!', timestamp: result.rows[0].now });
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        res.status(500).json({ error: 'Erro ao conectar ao banco de dados' });
    }
});

// Endpoint para testar a conexão com o banco de dados
app.get('/api/testar-conexao', async (req, res) => {
    try {
        const result = await pool.query('SELECT 1 AS resultado');
        res.json({ message: 'Conexão com o banco de dados bem-sucedida!', resultado: result.rows[0] });
    } catch (error) {
        console.error('Erro ao testar conexão com o banco de dados:', error);
        res.status(500).json({ error: 'Erro ao conectar ao banco de dados', detalhes: error.message });
    }
});

// Garantindo que o endpoint de listar eventos funcione corretamente
app.get('/api/eventos', async (req, res) => {
    try {
        console.log('Recebendo requisição para listar eventos...');
        const result = await pool.query('SELECT * FROM eventos ORDER BY data');
        console.log('Eventos retornados do banco de dados:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao listar eventos:', error);
        res.status(500).json({ error: 'Erro ao listar eventos', detalhes: error.message });
    }
});

// Adicionando logs detalhados para depuração
app.post('/api/eventos', async (req, res) => {
    const { nome, data, local } = req.body;

    console.log('Recebendo requisição para adicionar evento:', { nome, data, local });

    if (!nome || !data || !local) {
        console.error('Erro: Campos obrigatórios ausentes');
        return res.status(400).json({ error: 'Todos os campos (nome, data, local) são obrigatórios.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO eventos (nome, data, local) VALUES ($1, $2, $3) RETURNING *',
            [nome, data, local]
        );
        console.log('Evento adicionado com sucesso:', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao adicionar evento no banco de dados:', error);
        res.status(500).json({ error: 'Erro interno ao adicionar evento. Verifique o servidor.' });
    }
});

// Alterando o host para 0.0.0.0 para aceitar conexões externas
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://0.0.0.0:${port}`);
});
