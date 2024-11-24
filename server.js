// Importa os módulos necessários
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const SECRET_KEY = 'seu_segredo_aqui'; // Utilize variáveis de ambiente em produção

// Middleware para CORS e parsing de JSON
app.use(cors());
app.use(bodyParser.json());

// Configura a conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'rastech',
});

// Conecta ao banco de dados
db.connect((err) => {
  if (err) throw err;
  console.log('Conectado ao banco de dados MySQL!');
});

// Middleware para servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Rota para registrar usuários (CREATE do CRUD)
app.post('/register', (req, res) => {
  const { usuario_nome, usuario_senha, usuario_cargo } = req.body; // Obtém os dados do corpo da requisição

  // Validações adicionais para garantir consistência no cadastro
  if (usuario_cargo === "Administrador" || usuario_cargo === "Admin") {
    return res.status(400).json({ message: 'Não é possível cadastrar administradores.' });
  }

  if (!usuario_nome || !usuario_senha) {
    return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios.' });
  }

  // Verifica se o usuário já existe no banco de dados
  db.query('SELECT * FROM usuarios WHERE usuario_nome = ?', [usuario_nome], (err, results) => {
    if (err) {
      console.error('Erro ao verificar usuário:', err);
      return res.status(500).json({ message: 'Erro no servidor ao verificar o usuário.' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Usuário já existe.' });
    }

    // Insere o novo usuário no banco de dados
    db.query(
      'INSERT INTO usuarios (usuario_nome, usuario_senha, usuario_cargo) VALUES (?, ?, ?)',
      [usuario_nome, usuario_senha, usuario_cargo],
      (err) => {
        if (err) {
          console.error('Erro ao registrar usuário:', err);
          return res.status(500).json({ message: 'Erro no servidor ao registrar o usuário.' });
        }
        res.status(201).json({ message: 'Usuário registrado com sucesso.' });
      }
    );
  });
});

// Rota para listar todos os usuários (READ do CRUD)
app.post('/usuarios', (req, res) => {
  // Consulta todos os usuários do banco de dados, incluindo o ID
  db.query('SELECT usuario_id, usuario_nome, usuario_senha, usuario_cargo FROM usuarios', (err, results) => {
    if (err) {
      console.error('Erro ao obter usuários:', err);
      return res.status(500).json({ message: 'Erro no servidor ao obter usuários.' });
    }
    res.status(200).json(results); // Retorna os resultados como JSON
  });
});

// Rota de login
app.post('/login', (req, res) => {
  const { usuario_nome, usuario_senha } = req.body;

  try {
    // Consulta o usuário no banco de dados
    db.query(
      'SELECT usuario_nome, usuario_senha, usuario_cargo FROM usuarios WHERE usuario_nome = ?',
      [usuario_nome],
      (err, results) => {
        if (err) {
          console.error('Erro na consulta ao banco de dados:', err);
          return res.status(500).json({ message: 'Erro no servidor ao consultar o banco de dados' });
        }

        if (results.length === 0) {
          return res.status(400).json({ message: 'Usuário ou senha inválidos' });
        }

        const user = results[0];

        // Verifica se a senha está correta
        if (usuario_senha !== user.usuario_senha) {
          console.log('Senha incorreta para o usuário:', usuario_nome);
          return res.status(400).json({ message: 'Usuário ou senha inválidos' });
        }

        // Gera o token JWT
        const token = jwt.sign({ usuario_nome }, SECRET_KEY, { expiresIn: '1h' });

        // Define a rota de redirecionamento com base no cargo
        let rota;
        switch (user.usuario_cargo) {
          case 'Admin':
            rota = '/admin';
            break;
          case 'Médico':
            rota = '/medico';
            break;
          case 'Enfermeiro':
            rota = '/enfermeiro';
            break;
          case 'TécnicoDeEnfermagem':
            rota = '/tecnico_de_enfermagem';
            break;
          case 'Instrumentador':
            rota = '/instrumentador';
        }

        console.log('Login bem-sucedido. Redirecionando para:', rota);

        // Retorna o token e a rota de redirecionamento
        res.status(200).json({ token, redirect: rota });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/index', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rotas protegidas para páginas específicas
app.get('/admin', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
app.get('/medico', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'medico.html'));
});
app.get('/enfermeiro', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'enfermeiro.html'));
});
app.get('/tecnico_de_enfermagem', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tecnico_de_enfermagem.html'));
});
app.get('/instrumentador', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'instrumentador.html'));
});


// Rota para atualizar um usuário existente
app.put('/usuarios/:id', (req, res) => {
  const usuario_id = req.params.id; // ID do usuário (não pode ser alterado)
  const { usuario_nome, usuario_senha, usuario_cargo } = req.body; // Novos dados do usuário

  // Validações básicas
  if (!usuario_nome || !usuario_senha || !usuario_cargo) {
    return res.status(400).json({ message: 'Nome, senha e cargo são obrigatórios.' });
  }

  // Atualiza apenas nome, senha e cargo no banco de dados
  db.query(
    'UPDATE usuarios SET usuario_nome = ?, usuario_senha = ?, usuario_cargo = ? WHERE usuario_id = ?',
    [usuario_nome, usuario_senha, usuario_cargo, usuario_id],
    (err, result) => {
      if (err) {
        console.error('Erro ao atualizar usuário:', err);
        return res.status(500).json({ message: 'Erro no servidor ao atualizar o usuário.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      res.status(200).json({ message: 'Usuário atualizado com sucesso.' });
    }
  );
});


// Rota para deletar o usuário
app.delete('/usuarios/:id', (req, res) => {
  const usuario_id = req.params.id;

  db.query('DELETE FROM usuarios WHERE usuario_id = ?', [usuario_id], (err, result) => {
    if (err) {
      console.error('Erro ao excluir usuário:', err);
      return res.status(500).json({ message: 'Erro no servidor ao excluir o usuário' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({ message: 'Usuário excluído com sucesso' });
  });
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
