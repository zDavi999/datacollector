const express = require('express');
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  return res.json("hello world 1 ");
})


app.get("/strings", (req, res) => {
  return res.json("hello world");
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});