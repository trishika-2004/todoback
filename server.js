const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL || "mongodb://todouser:todo1234@localhost:27017/tododb")
  .then(() => console.log("MongoDB connected!"))
  .catch(err => console.log("MongoDB error:", err));

// Todo Schema
const todoSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false }
});
const Todo = mongoose.model("Todo", todoSchema);

// Seed data if empty
const seedData = async () => {
  const count = await Todo.countDocuments();
  if (count === 0) {
    await Todo.insertMany([
      { title: "Set up AWS EC2 instance", completed: true },
      { title: "Configure Nginx reverse proxy", completed: true },
      { title: "Deploy Node.js backend with PM2", completed: false },
      { title: "Connect frontend to API", completed: false },
      { title: "Test end-to-end on EC2", completed: false },
    ]);
    console.log("Seeded initial todos!");
  }
};
seedData();

// Routes
app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.get("/api/todos/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.status(404).json({ error: "Not found" });
  res.json(todo);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});