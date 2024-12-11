import React, { useState, useEffect, useCallback } from "react";
import axios from "axios"; 
import "./Stuquiz.css";
const StudentQuiz = () => {
  const [screen, setScreen] = useState("start"); 
  const [studentName, setStudentName] = useState("");
  const [quizCode, setQuizCode] = useState("");
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1800); 
  const [answers, setAnswers] = useState({});

  const handleSubmit = useCallback(() => {
    const collectedAnswers = questions.map((question) => ({
      questionId: question._id,
      answer: answers[question._id] || "",
    }));

    console.log({
      studentName,
      quizCode,
      answers: collectedAnswers,
      timeRemaining: timeLeft,
    });

    
    // axios.post(`http://localhost:5000/api/submitQuiz`, { studentName, quizCode, answers: collectedAnswers });
    setScreen("submit");
  }, [questions, answers, studentName, quizCode, timeLeft]);

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
  }, [screen, handleSubmit]);

  const handleStart = async () => {
    if (!studentName || quizCode.length !== 16) {
      alert("Please enter your name and a valid 16-character quiz code!");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/quizzes/${quizCode}`);
      const quizData = response.data;

      if (!quizData || !quizData.questions || quizData.questions.length === 0) {
        alert("Invalid quiz code or no questions available!");
        return;
      }

      setQuestions(quizData.questions);
      setTimeLeft(quizData.quizTime || 1800); 
      setScreen("quiz");
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      alert("Failed to fetch quiz. Please check the quiz code and try again.");
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: value }));
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
        Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
      </div>
      <div className="questions-container">
        {questions.map((question, index) => (
          <div key={question._id} className="question-card">
            <div className="question-text">
              Question {index + 1}: {question.text}
            </div>
            <textarea
              placeholder="Type your answer here"
              value={answers[question._id] || ""}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
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
