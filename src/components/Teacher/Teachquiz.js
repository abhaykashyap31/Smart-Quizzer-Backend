import React, { useState } from "react";
import axios from "axios"; // For making API requests
import "./Teachquiz.css";

const TeacherQuiz = () => {
  const [quizCode, setQuizCode] = useState("");
  const [quizCodeError, setQuizCodeError] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionInput, setQuestionInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [quizTime, setQuizTime] = useState(""); // New state for quiz time
  const [quizTimeError, setQuizTimeError] = useState(false); // Error state for quiz time

  const addQuestion = () => {
    if (questionInput.trim() && answerInput.trim()) {
      const newQuestion = {
        text: questionInput,
        answer: answerInput,
      };
      setQuestions([...questions, newQuestion]);
      setQuestionInput("");
      setAnswerInput("");
    } else {
      alert("Please enter both a question and an answer!");
    }
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const resetFields = () => {
    setQuizCode("");
    setQuizTime("");
    setQuestions([]);
    setQuestionInput("");
    setAnswerInput("");
  };

  const createQuiz = async () => {
    if (quizCode.length !== 16) {
      setQuizCodeError(true);
      return;
    }
    setQuizCodeError(false);

    if (!quizTime || isNaN(quizTime) || parseInt(quizTime) <= 0) {
      setQuizTimeError(true);
      return;
    }
    setQuizTimeError(false);

    if (questions.length > 0) {
      const formattedQuestions = questions.reduce((acc, question, index) => {
        acc[`question ${index + 1}`] = question.text;
        acc[`answer ${index + 1}`] = question.answer;
        return acc;
      }, {});

      const quizData = {
        quizCode,
        quizTime: parseInt(quizTime), // Include quiz time in seconds
        ...formattedQuestions,
      };

      console.log("Sending payload:", quizData); // Debug payload

      try {
        const response = await axios.post("http://localhost:5000/api/quizzes", quizData);
        console.log("Quiz created successfully:", response.data);
        alert(
          `Quiz created with code: ${quizCode}\nNumber of questions: ${questions.length}\nTime: ${quizTime} seconds`
        );
        resetFields(); // Reset fields after successful quiz creation
      } catch (error) {
        console.error("Error creating quiz:", error);
      }
    } else {
      alert("Please add at least one question before creating a quiz!");
    }
  };

  return (
    <div className="Teacher-quiz">
      <div className="quiz-container">
        <h1>🎉 Quiz Creator 🧐</h1>

        <div className="quiz-code-input">
          <input
            type="text"
            value={quizCode}
            onChange={(e) => setQuizCode(e.target.value)}
            placeholder="Enter Quiz Code"
            maxLength="16"
          />
        </div>
        {quizCodeError && <div className="error-message">Quiz code must be exactly 16 characters long!</div>}

        <div className="quiz-time-input">
          <input
            type="integer"
            value={quizTime}
            onChange={(e) => setQuizTime(e.target.value)}
            placeholder="Enter Quiz Time (in seconds)"
            min="1"
          />
        </div>
        {quizTimeError && <div className="error-message">Please enter a valid quiz time in seconds!</div>}

        <div className="question-input">
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="Enter your question"
          />
          <textarea
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            placeholder="Enter the correct answer"
          ></textarea>
        </div>

        <div className="button-group">
          <button onClick={addQuestion}>Add Question</button>
          <button onClick={createQuiz}>Create Quiz</button>
        </div>

        <div className="questions-list">
          {questions.map((question, index) => (
            <div className="question-item" key={index}>
              <span>
                <strong>Q:</strong> {question.text}
              </span>
              <button onClick={() => removeQuestion(index)}>🗑</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherQuiz;
