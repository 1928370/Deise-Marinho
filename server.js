const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
    user: 'agende_aqui', // Nome do usuário do banco de dados
    host: 'localhost',   // Endereço do servidor PostgreSQL
    database: 'notelook', // Nome do banco de dados
    password: 'Adm@2022#', // Senha do usuário
    port: 5432,           // Porta padrão do PostgreSQL
});

// Testar conexão com o banco de dados
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conexão bem-sucedida ao banco de dados:', res.rows[0]);
    }
});

// Rota para registrar um novo usuário
app.post('/usuarios', async (req, res) => {
    const { username, password } = req.body;
    try {
        await pool.query(
            'INSERT INTO usuarios (username, password) VALUES ($1, $2)',
            [username, password]
        );
        res.status(201).send('Usuário cadastrado com sucesso');
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        if (err.code === '23505') { // Código de erro para UNIQUE constraint
            res.status(400).send('Usuário já existe');
        } else {
            res.status(500).send('Erro ao cadastrar usuário');
        }
    }
});

// Rota para autenticar um usuário
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE username = $1 AND password = $2',
            [username, password]
        );

        if (result.rows.length > 0) {
            res.status(200).send('Login bem-sucedido');
        } else {
            res.status(401).send('Usuário ou senha inválidos');
        }
    } catch (err) {
        console.error('Erro ao autenticar usuário:', err);
        res.status(500).send('Erro no servidor');
    }
});

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
