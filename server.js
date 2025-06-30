import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let todos = [];
let idCounter = 1;

// Tüm görevleri getir
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// Yeni görev ekle
app.post('/api/todos', (req, res) => {
  const { text, startDate, endDate, status } = req.body;
  const newTodo = {
    id: idCounter++,
    text,
    startDate,
    endDate,
    status: status || 1,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Görev güncelle
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { text, startDate, endDate, status } = req.body;
  const todo = todos.find((t) => t.id === parseInt(id));
  if (!todo) return res.status(404).json({ error: 'Görev bulunamadı' });
  todo.text = text;
  todo.startDate = startDate;
  todo.endDate = endDate;
  todo.status = status;
  res.json(todo);
});

// Görev sil
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.filter((t) => t.id !== parseInt(id));
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`ToDo API sunucusu http://localhost:${port} adresinde çalışıyor`);
}); 