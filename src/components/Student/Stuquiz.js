import React, { useState, useEffect } from "react";
import "./Stuquiz.css";

const StudentQuiz = () => {
  const [screen, setScreen] = useState("start"); // start, quiz, submit
  const [studentName, setStudentName] = useState("");
  const [quizCode, setQuizCode] = useState("");
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (screen === "quiz") {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [screen]);

  const handleStart = () => {
    if (!studentName || quizCode.length !== 16) {
      alert("Please enter your name and a valid 16-character quiz code!");
      return;
    }

    // Mock questions (in a real app, fetch from backend)
    const mockQuestions = [
      { id: 1, text: "What is the capital of France?" },
      { id: 2, text: "Explain the concept of photosynthesis." },
      { id: 3, text: "Solve the equation: 2x + 5 = 15" },
    ];

    setQuestions(mockQuestions);
    setScreen("quiz");
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: value }));
  };

  const handleSubmit = () => {
    // Collect the answers
    const collectedAnswers = questions.map((question) => ({
      questionId: question.id,
      answer: answers[question.id] || "",
    }));

    console.log({
      studentName,
      quizCode,
      answers: collectedAnswers,
      timeRemaining: timeLeft,
    });

    setScreen("submit");
  };

  const renderStartScreen = () => (
    <div className="start-screen">
      <h1>🌟 Take Your Quiz! 📝</h1>
      <input
        type="text"
        placeholder="Enter Your Name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Quiz Code"
        maxLength="16"
        value={quizCode}
        onChange={(e) => setQuizCode(e.target.value)}
      />
      <button onClick={handleStart}>Begin Quiz</button>
    </div>
  );

  const renderQuizScreen = () => (
    <div className="quiz-screen">
      <div className="timer">
        Time Left: {Math.floor(timeLeft / 60)}:
        {String(timeLeft % 60).padStart(2, "0")}
      </div>
      <div className="questions-container">
        {questions.map((question, index) => (
          <div key={question.id} className="question-card">
            <div className="question-text">
              Question {index + 1}: {question.text}
            </div>
            <textarea
              placeholder="Type your answer here"
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            ></textarea>
          </div>
        ))}
      </div>
      <button onClick={handleSubmit}>Submit Quiz</button>
    </div>
  );

  const renderSubmitScreen = () => (
    <div className="submit-screen">
      <h2>🎉 Quiz Submitted! 🏆</h2>
      <p>Thank you for completing the quiz, {studentName}!</p>
    </div>
  );

  return (
    <div className="Student-quiz">
      <div className="quiz-container">
        {screen === "start" && renderStartScreen()}
        {screen === "quiz" && renderQuizScreen()}
        {screen === "submit" && renderSubmitScreen()}
      </div>
    </div>
  );
};

export default StudentQuiz;
