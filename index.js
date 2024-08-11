const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const dbFilePath = path.resolve(__dirname, 'strings.db');

// Cria ou abre o banco de dados SQLite
const db = new sqlite3.Database(dbFilePath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite');
    // Cria a tabela se não existir
    db.run(`CREATE TABLE IF NOT EXISTS strings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      string TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error('Erro ao criar tabela:', err.message);
      }
    });
  }
});

// Rota para receber e salvar a string
app.post("/add", (req, res) => {
  const { string } = req.body;

  if (typeof string === 'string') {
    const stmt = db.prepare("INSERT INTO strings (string) VALUES (?)");
    stmt.run(string, function (err) {
      if (err) {
        console.error('Erro ao salvar no banco de dados:', err.message);
        res.status(500).json({ error: 'Erro ao salvar no banco de dados' });
      } else {
        res.status(200).json({ message: 'String salva com sucesso' });
      }
    });
    stmt.finalize();
  } else {
    res.status(400).json({ error: 'Dados inválidos' });
  }
});

// Rota para retornar as strings salvas
app.get("/strings", (req, res) => {
  db.all("SELECT * FROM strings", [], (err, rows) => {
    if (err) {
      console.error('Erro ao ler do banco de dados:', err.message);
      res.status(500).json({ error: 'Erro ao ler do banco de dados' });
    } else {
      res.status(200).json(rows);
    }
  });
});

// Rota de teste
app.get("/", (req, res) => {
  return res.json("hello world 1 ");
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});