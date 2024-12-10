import React, { useState } from "react";
import "./Teachquiz.css";

const TeacherQuiz = () => {
  const [quizCode, setQuizCode] = useState("");
  const [quizCodeError, setQuizCodeError] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionInput, setQuestionInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");

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

  const createQuiz = () => {
    if (quizCode.length !== 16) {
      setQuizCodeError(true);
      return;
    }
    setQuizCodeError(false);

    if (questions.length > 0) {
      alert(`Quiz created with code: ${quizCode}\nNumber of questions: ${questions.length}`);
      console.log({
        quizCode,
        questions,
      });
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
          placeholder="Enter 16-character Quiz Code"
          maxLength="16"
        />
      </div>
      {quizCodeError && <div className="error-message">Quiz code must be exactly 16 characters long!</div>}

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
    </div></div>
  );
};

export default TeacherQuiz;
