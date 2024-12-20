import React, { useState } from "react";
import axios from "axios";
import "./Teachquiz.css";

const TeacherQuiz = () => {
  const [quizCode, setQuizCode] = useState("");
  const [quizCodeError, setQuizCodeError] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionType, setQuestionType] = useState("text"); 
  const [questionInput, setQuestionInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [marksInput, setMarksInput] = useState("");
  const [quizTime, setQuizTime] = useState("");
  const [quizTimeError, setQuizTimeError] = useState(false);
  const [mcqOptions, setMcqOptions] = useState([]); 
  const [correctOptions, setCorrectOptions] = useState([]); 
  const [imageFile, setImageFile] = useState(""); 

  const resetFields = () => {
    setQuizCode("");
    setQuizTime("");
    setQuestions([]);
    setQuestionInput("");
    setAnswerInput("");
    setMarksInput("");
    setMcqOptions([]);
    setCorrectOptions([]);
    setImageFile("");
  };

  const addOption = () => {
    if (questionType === "mcq" && mcqOptions.length < 6) {
      setMcqOptions([...mcqOptions, ""]);
    } else {
      alert("You can add up to 6 options only!");
    }
  };

  const updateOption = (index, value) => {
    const updatedOptions = [...mcqOptions];
    updatedOptions[index] = value;
    setMcqOptions(updatedOptions);
  };

  const toggleCorrectOption = (index) => {
    const updatedCorrectOptions = [...correctOptions];
    if (updatedCorrectOptions.includes(index)) {
      updatedCorrectOptions.splice(updatedCorrectOptions.indexOf(index), 1);
    } else {
      updatedCorrectOptions.push(index);
    }
    setCorrectOptions(updatedCorrectOptions);
  };

  const addQuestion = () => {
    if (questionType === "mcq") {
      if (mcqOptions.length < 2 || correctOptions.length === 0) {
        alert("Please provide at least two options and mark correct answers!");
        return;
      }
     
      const correctAnswers = correctOptions.map((index) => mcqOptions[index]);
      const newQuestion = {
        type: "mcq",
        text: questionInput,
        options: mcqOptions,
        answer: String(correctAnswers),
        marks: parseInt(marksInput),
      };
      setQuestions([...questions, newQuestion]);
    } 
    else if (questionType === "image") {
      if (imageFile===null) {
        alert("Please upload an image for this question!");
        return;
      }
      const newQuestion = {
        type: "image",
        text: questionInput,
        image: String(imageFile),
        answer: answerInput,
        marks: parseInt(marksInput),
      };
      setQuestions([...questions, newQuestion]);
    } else {
      const newQuestion = {
        type: "text",
        text: questionInput,
        answer: answerInput,
        marks: parseInt(marksInput),
      };
      setQuestions([...questions, newQuestion]);
    }

    setQuestionInput("");
    setAnswerInput("");
    setMarksInput("");
    setMcqOptions([]);
    setCorrectOptions([]);
    setImageFile("");
  };

  const downloadFile = (quizData) => {
    const data = JSON.stringify(quizData);
    const blob = new Blob([data], { type: "text/plain" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'quizData.txt';
    link.click();
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
      const quizData = {
        quizCode,
        quizTime: parseInt(quizTime),
      };

      questions.forEach((question, index) => {
        const questionNumber = index + 1;
        quizData[`question_${questionNumber}`] = question.text;
        quizData[`type_${questionNumber}`] = question.type;
        quizData[`marks_${questionNumber}`] = question.marks;

        if (question.type === "mcq") {
          quizData[`options_${questionNumber}`] = question.options;
          quizData[`answer_${questionNumber}`] = question.answer; 
        } else if (question.type === "image") {
          quizData[`image_${questionNumber}`] = question.image;
          quizData[`answer_${questionNumber}`] = question.answer;
        } else {
          quizData[`answer_${questionNumber}`] = question.answer;
        }
      });

      console.log("Formatted quiz data:", quizData);

      try {
        const response = await axios.post("http://localhost:5000/api/quizzes", quizData);
        console.log("Quiz created successfully:", response.data);
        alert(`Quiz created successfully with code: ${quizCode}`);
        downloadFile(quizData); 
        resetFields();
      } catch (error) {
        downloadFile(quizData); 
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
            type="number"
            value={quizTime}
            onChange={(e) => setQuizTime(e.target.value)}
            placeholder="Enter Quiz Time (in seconds)"
            min="1"
          />
        </div>
        {quizTimeError && <div className="error-message">Please enter a valid quiz time in seconds!</div>}

        <div className="question-type-selector">
          <label>Question Type:</label>
          <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
            <option value="text">Text Question</option>
            <option value="mcq">MCQ</option>
            <option value="image">Image-Based</option>
          </select>
        </div>

        <div className="question-input">
          <textarea
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="Enter your question"
          />
          {questionType === "image" && (
            <input type="text" value={imageFile} onChange={(e) => setImageFile(e.target.value)} placeholder="Add Image Url" />
          )}
          {questionType === "mcq" && (
            <div className="mcq-options">
              {mcqOptions.map((option, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <input
                    type="checkbox"
                    checked={correctOptions.includes(index)}
                    onChange={() => toggleCorrectOption(index)}
                  />
                  Correct
                </div>
              ))}
              <button onClick={addOption}>Add Option</button>
            </div>
          )}
          <textarea
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            placeholder="Enter the correct answer"
            style={{ display: questionType === "mcq" ? "none" : "block" }}
          ></textarea>
          <input
            type="number"
            value={marksInput}
            onChange={(e) => setMarksInput(e.target.value)}
            placeholder="Enter marks for this question"
            min="1"
          />
        </div>

        <div className="button-group">
          <button onClick={addQuestion}>Add Question</button>
          <button onClick={createQuiz}>Create Quiz</button>
        </div>

        <div className="questions-list">
          {questions.map((question, index) => (
            <div className="question-item" key={index}>
              <span>
                <strong>Q:</strong> {question.text} ({question.marks} marks)
              </span>
              <button onClick={() => setQuestions(questions.filter((_, i) => i !== index))}>🗑</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherQuiz;
