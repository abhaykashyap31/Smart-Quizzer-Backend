const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const app = express();
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions)); 

mongoose
  .connect("mongodb://127.0.0.1:27017/Quizdb")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

const quizSchema = new mongoose.Schema({
  quizCode: { type: String, unique: true, required: true },
  quizTime: { type: Number, required: true },
  questions: [
    {
      type: {
        type: String,
        enum: ["text", "mcq", "image"], 
        required: true,
      },
      text: { type: String, required: true },
      options: { type: [String], required: function () { return this.type === "mcq"; } }, 
      correctAnswers: { type: [Number], default: [] }, 
      image: { type: String, default: null }, 
      answer: { type: String, default: "" }, 
      marks: { type: Number, required: true },
    },
  ],
});

const Quiz = mongoose.model("quizzes", quizSchema);

const gradeSchema = new mongoose.Schema({
  quizCode: { type: String, required: true },
  studentUserId: { type: String, required: true },
  results: [
    {
      question: String,
      correctAnswer: String,
      studentAnswer: String,
      similarityScore: Number,
      marksObtained: Number,
      totalMarks: Number,
    },
  ],
  totalMarks: { type: Number, required: true },
  obtainedMarks: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Grade = mongoose.model("Grades", gradeSchema);

app.post("/api/quizzes", async (req, res) => {
  try {
    const { quizCode, quizTime, ...rest } = req.body;

    if (!quizCode || !quizTime || quizTime <= 0) {
      return res.status(400).json({ error: "Quiz code and valid time are required" });
    }

    const questions = [];
    const questionKeys = Object.keys(rest).filter((key) => key.startsWith("question_"));

    questionKeys.forEach((questionKey) => {
      const index = questionKey.split("_")[1];
      const typeKey = `type_${index}`;
      const optionsKey = `options_${index}`;
      const marksKey = `marks_${index}`;
      const answerKey = `answer_${index}`;
      const imageKey = `image_${index}`;

      if (!rest[typeKey] || !rest[marksKey]) {
        return res.status(400).json({ error: `Type and marks are required for question ${index}` });
      }

      questions.push({
        text: rest[questionKey],
        type: rest[typeKey],
        options: rest[optionsKey] || [],
        correctAnswers: rest[`correctAnswers_${index}`] || [],
        image: rest[imageKey] || null,
        answer: rest[answerKey] || null,
        marks: parseInt(rest[marksKey], 10),
      });
    });

    if (questions.length === 0) {
      return res.status(400).json({ error: "At least one question is required" });
    }

    const quiz = new Quiz({ quizCode, quizTime, questions });
    await quiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ error: "Failed to create quiz" });
  }
});

app.get("/api/quizzes/:quizCode", async (req, res) => {
  try {
    const { quizCode } = req.params;
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

const getSimilarityScore = async (answer1, answer2) => {
  const url = "https://api-inference.huggingface.co/models/sentence-transformers/paraphrase-MiniLM-L6-v2";
  const headers = { Authorization: `Bearer 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` };

  try {
    const response = await axios.post(
      url,
      {
        inputs: { source_sentence: answer1, sentences: [answer2] },
      },
      { headers }
    );
    return response.data[0];
  } catch (error) {
    console.error("Error with Hugging Face API:", error);
    return 0;
  }
};

function transformFormat(student_answers, questionId, quiz) {
  const studentAnswer = student_answers[questionId] || "";
  const question = quiz.questions.find(q => q._id.toString() === questionId); 

  if (!question) {
    return;
  }

  const transformedData = {
    inputs: {
      source_sentence: studentAnswer, 
      sentences: [question.answer]     
    }
  };
  return JSON.stringify(transformedData, null, 2);
}


app.post("/evaluate", async (req, res) => {
  const { quiz_code, student_user_id, student_answers, time_remaining } = req.body;

  try {
    const quiz = await Quiz.findOne({ quizCode: quiz_code });
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    const results = [];
    let totalMarks = 0;
    let obtainedMarks = 0;

    for (const questionId of Object.keys(student_answers)) {
      const studentAnswer = student_answers[questionId] || "";
      const question = quiz.questions.find(q => q._id.toString() === questionId); 
      if (!question) {
        continue; 
      }
      const transformedInput = transformFormat(student_answers, questionId, quiz);

      const parsedInput = JSON.parse(transformedInput);
      const similarityScore = await getSimilarityScore(
        parsedInput.inputs.source_sentence,
        parsedInput.inputs.sentences[0]
      );
      const marksObtained = similarityScore * question.marks;

      results.push({
        question: question.text,
        correctAnswer: question.answer,
        studentAnswer,
        similarityScore,
        marksObtained,
        totalMarks: question.marks,
      });

      totalMarks += question.marks;
      obtainedMarks += marksObtained;
    }

    const grade = new Grade({
      quizCode: quiz_code,
      studentUserId: student_user_id,
      results,
      totalMarks,
      obtainedMarks,
    });
    await grade.save();
    res.status(200).json({ message: "Quiz evaluated and grade saved successfully" });
  } catch (error) {
    console.error("Error evaluating quiz:", error);
    res.status(500).json({ error: "An error occurred during evaluation" });
  }
});



app.listen(5000, () => console.log("Server running on http://localhost:5000"));