const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'rastech'
});

db.connect(error => {
    if (error) {
        console.error('Erro ao conectar ao banco de dados: ' + error.stack);
        return;
    }
    console.log('Conectado ao banco de dados com ID ' + db.threadId);
});

// Endpoint para adicionar um usuário (POST)
app.post('/usuarios', (req, res) => {
    const { nome, email, senha } = req.body;
    bcrypt.hash(senha, 10, (err, senhaCriptografada) => {
        if (err) {
            res.status(500).send('Erro ao criptografar a senha.');
            return;
        }
        const sql = 'INSERT INTO usuarios (nome_usuario, email_usuario, senha_usuario) VALUES (?, ?, ?)';
        db.query(sql, [nome, email, senhaCriptografada], (error, results) => {
            if (error) {
                res.status(500).send('Erro ao adicionar o usuário.');
                return;
            }
            res.status(201).send('Usuário adicionado com sucesso.');
        });
    });
});

// Endpoint para obter todos os usuários (GET)
app.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (error, results) => {
        if (error) {
            res.status(500).send('Erro ao buscar os usuários.');
            return;
        }
        res.json(results);
    });
});

// Endpoint para obter um usuário pelo ID (GET)
app.get('/usuarios/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id_usuario], (error, results) => {
        if (error) {
            res.status(500).send('Erro ao buscar o usuário.');
            return;
        }
        res.json(results[0]);
    });
});

// Endpoint para atualizar um usuário (PUT)
app.put('/usuarios/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    const { nome, email, senha } = req.body;

    if (senha) {
        bcrypt.hash(senha, 10, (err, senhaCriptografada) => {
            if (err) {
                res.status(500).send('Erro ao criptografar a senha.');
                return;
            }
            const sql = 'UPDATE usuarios SET nome_usuario = ?, email_usuario = ?, senha_usuario = ? WHERE id_usuario = ?';
            db.query(sql, [nome, email, senhaCriptografada, id_usuario], handleUpdate);
        });
    } else {
        const sql = 'UPDATE usuarios SET nome_usuario = ?, email_usuario = ? WHERE id_usuario = ?';
        db.query(sql, [nome, email, id_usuario], handleUpdate);
    }

    function handleUpdate(error, results) {
        if (error) {
            res.status(500).send('Erro ao atualizar o usuário.');
            return;
        }
        res.send('Usuário atualizado com sucesso.');
    }
});

// Endpoint para deletar um usuário (DELETE)
app.delete('/usuarios/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id_usuario], (error, results) => {
        if (error) {
            res.status(500).send('Erro ao deletar o usuário.');
            return;
        }
        res.send('Usuário deletado com sucesso.');
    });
});

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
