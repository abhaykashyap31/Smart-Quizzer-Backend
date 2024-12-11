const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/Quizdb")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

const quizSchema = new mongoose.Schema({
  quizCode: { type: String, unique: true, required: true },
  quizTime: { type: Number, required: true }, 
  questions: [
    {
      text: String,
      answer: String,
    },
  ],
});

const Quiz = mongoose.model("Quiz", quizSchema);

// POST endpoint to create a quiz
app.post("/api/quizzes", async (req, res) => {
  try {
    const { quizCode, quizTime, ...rest } = req.body;

    if (!quizCode) {
      return res.status(400).json({ error: "Quiz code is required" });
    }

    if (!quizTime || typeof quizTime !== "number" || quizTime <= 0) {
      return res.status(400).json({ error: "Valid quiz time is required" });
    }

    // Process dynamic fields into an array of question-answer objects
    const questions = [];
    const keys = Object.keys(rest);
    const questionKeys = keys.filter((key) => key.startsWith("question"));

    questionKeys.forEach((questionKey) => {
      const index = questionKey.split(" ")[1];
      const answerKey = `answer ${index}`;

      if (rest[answerKey]) {
        questions.push({
          text: rest[questionKey],
          answer: rest[answerKey],
        });
      }
    });

    if (questions.length === 0) {
      return res.status(400).json({ error: "At least one question is required" });
    }

    // Save quiz to MongoDB
    const quiz = new Quiz({ quizCode, quizTime, questions });
    await quiz.save();

    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ error: "Failed to create quiz" });
  }
});

// GET endpoint to retrieve quiz by quizCode
app.get("/api/quizzes/:quizCode", async (req, res) => {
  try {
    const { quizCode } = req.params;

    // Find quiz by quizCode
    const quiz = await Quiz.findOne({ quizCode });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error("Error retrieving quiz:", error);
    res.status(500).json({ error: "Failed to retrieve quiz" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
