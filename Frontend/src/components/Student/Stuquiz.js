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
  const [gradeSaved, setGradeSaved] = useState(false);  // To track if grade is saved
  
  const downloadFile = (quizData) => {
    // Convert the quizData to a raw string (no formatting)
    const data = JSON.stringify(quizData);
  
    const blob = new Blob([data], { type: "text/plain" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'quizData.txt'; // Specify the file name
    link.click(); // Trigger the download
  };
  
  const handleSubmit = useCallback(() => {
    const collectedAnswers = questions.reduce((acc, question) => {
      const answer = answers[question._id] || ""; // Use question._id as key
    
      // Standardize answer format (either array to string or string to array)
      if (Array.isArray(answer)) {
        acc[question._id] = answer.join(","); // Convert array to comma-separated string
      } else {
        acc[question._id] = answer;
      }

      return acc;
    }, {});

    const submissionData = {
      quiz_code: quizCode,
      student_user_id: studentName,
      student_answers: collectedAnswers,
      time_remaining: timeLeft,
    };

    console.log(submissionData);

    axios
      .post("http://localhost:5000/evaluate", submissionData)
      .then((response) => {
        alert("Quiz submitted successfully:");
        setGradeSaved(true);
        setScreen("submit");
      })
      .catch((error) => {
        console.error("Error submitting quiz:", error.response?.data || error.message);
        alert("There was an issue submitting your quiz. Please try again later.");
      });
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
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value, // Use questionId (from the quiz data) instead of the index
    }));
  };

  const renderQuestion = (question, index) => {
    const questionId = question._id; // Use _id as the unique identifier

    if (question.type === "mcq") {
      return (
        <div key={questionId} className="question-card">
          <div className="question-text">
            Question {index + 1}: {question.text}
          </div>
          <div className="options">
            {question.options.map((option, optionIndex) => {
              const selectedOptions = answers[questionId] || [];
              const isChecked = selectedOptions.includes(option);

              return (
                <div key={`${questionId}_${optionIndex}`} className="option">
                  <input
                    type="checkbox"
                    id={`${questionId}_${optionIndex}`}
                    checked={isChecked}
                    onChange={(e) => {
                      const updatedOptions = e.target.checked
                        ? [...selectedOptions, option]
                        : selectedOptions.filter((opt) => opt !== option);
    
                      handleAnswerChange(questionId, updatedOptions);
                    }}
                  />
                  <label htmlFor={`${questionId}_${optionIndex}`}>{option}</label>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (question.type === "image" || question.type === "text") {
      return (
        <div key={questionId} className="question-card">
          <div className="question-text">
            Question {index + 1}: {question.text}
          </div>
          {question.image && <img src={question.image} alt="Question" />}
          <textarea
            placeholder="Type your answer here"
            value={answers[questionId] || ""}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
          ></textarea>
        </div>
      );
    }

    return null;
  };

  const renderStartScreen = () => (
    <div className="start-screen">
      <h1>🌟 Take Your Quiz! 📝</h1>
      <input
        type="text"
        placeholder="Enter Your Roll Number"
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
        {questions.map(renderQuestion)}
      </div>
      <button onClick={handleSubmit}>Submit Quiz</button>
    </div>
  );

  const renderSubmitScreen = () => (
    <div className="submit-screen">
      <h2>🎉 Quiz Submitted! 🏆</h2>
      <p>Thank you for completing the quiz, {studentName}!</p>
      {gradeSaved && <p>Your grade has been saved successfully!</p>}
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
