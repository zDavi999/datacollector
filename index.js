const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const stringsFilePath = path.resolve(__dirname, 'strings.json');

// Cria o arquivo strings.json se ele não existir
if (!fs.existsSync(stringsFilePath)) {
  fs.writeFileSync(stringsFilePath, JSON.stringify([]));
}

// Rota para receber e salvar a string
app.post("/add", (req, res) => {
  const { string } = req.body;

  if (typeof string === 'string') {
    fs.readFile(stringsFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Erro ao ler o arquivo:', err);
        return res.status(500).json({ error: 'Erro ao ler o arquivo' });
      }

      let strings;
      try {
        strings = JSON.parse(data);
      } catch (parseError) {
        console.error('Erro ao analisar o JSON:', parseError);
        return res.status(500).json({ error: 'Erro ao analisar o JSON' });
      }

      strings.push(string);

      fs.writeFile(stringsFilePath, JSON.stringify(strings, null, 2), (err) => {
        if (err) {
          console.error('Erro ao salvar o arquivo:', err);
          return res.status(500).json({ error: 'Erro ao salvar o arquivo' });
        }
        res.status(200).json({ message: 'String salva com sucesso' });
      });
    });
  } else {
    res.status(400).json({ error: 'Dados inválidos' });
  }
});

// Rota para retornar as strings salvas
app.get("/strings", (req, res) => {
  fs.readFile(stringsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      return res.status(500).json({ error: 'Erro ao ler o arquivo' });
    }

    let strings;
    try {
      strings = JSON.parse(data);
    } catch (parseError) {
      console.error('Erro ao analisar o JSON:', parseError);
      return res.status(500).json({ error: 'Erro ao analisar o JSON' });
    }

    res.status(200).json(strings);
  });
});

// Rota de teste
app.get("/", (req, res) => {
  return res.json("hello world 1 ");
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});