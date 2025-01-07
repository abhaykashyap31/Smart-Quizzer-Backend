import React, { useState } from "react";
import axios from "axios";
import "./Classperf.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ClassPerf = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [quizCode, setQuizCode] = useState("");
  const [error, setError] = useState("");

  const Report = () => {
  if (!performanceData || !performanceData.students.length) {
    alert("No data available to export.");
    return;
  }

  const doc = new jsPDF();

  // Set title
  doc.setFontSize(16);
  doc.text(`Quiz Report: ${quizCode}`, 14, 20);

  // Define Table Columns
  const tableColumns = ["Student User ID","Percentage"];

  // Generate Table Rows
  const tableRows = performanceData.students.map((student) => [
    student.name,
    `${student.score.toFixed(2)}%`,
  ]);

  // Add Table to PDF
  doc.autoTable({
    head: [tableColumns],
    body: tableRows,
    startY: 30,
  });

  // Save PDF
  doc.save(`Quiz_Report_${quizCode}.pdf`);
};


 const fetchQuizData = async () => {
  try {
    setError(""); // Clear any previous errors
    const response = await axios.get(`http://localhost:5000/api/grades/${quizCode}`);
    const grades = response.data.grades;

    // Transform grades into performance data format
    const students = grades.map((grade) => ({
      name: grade.studentUserId, // Assuming `studentUserId` is the student's name/identifier
      score: (grade.obtainedMarks / grade.totalMarks) * 100,
      time: "N/A", // Placeholder, update if you track time per student
    }));

    const totalScores = students.reduce((sum, student) => sum + student.score, 0);
    const highestScore = Math.max(...students.map((student) => student.score)).toFixed(3);
    const lowestScore = Math.min(...students.map((student) => student.score)).toFixed(3);
    const averageScore = (totalScores / students.length).toFixed(2);

    // Aggregate question performance
    const questionPerformanceMap = {};
    grades.forEach((grade) => {
      grade.results.forEach((result, index) => {
        if (!questionPerformanceMap[index]) {
          questionPerformanceMap[index] = { totalScore: 0, count: 0 };
        }
        questionPerformanceMap[index].totalScore +=
          (result.marksObtained / result.totalMarks) * 100;
        questionPerformanceMap[index].count += 1;
      });
    });

    const questionPerformance = Object.keys(questionPerformanceMap).map((key) => ({
      question: `Q${parseInt(key) + 1}`,
      score: Number(
        questionPerformanceMap[key].totalScore / questionPerformanceMap[key].count
      ), // Ensure score is a numeric value
    }));

    setPerformanceData({
      averageScore,
      highestScore,
      lowestScore,
      totalStudents: students.length,
      students,
      scoreDistribution: [], // Add logic for score distribution if needed
      questionPerformance,
    });
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    setError("Failed to fetch data. Please check the quiz code and try again.");
    setPerformanceData(null); // Clear any previous data
  }
};



  const getPerformanceColor = (score) => {
    if (score >= 80) return "#2ecc71"; // Green
    if (score >= 60) return "#f39c12"; // Orange
    return "#e74c3c"; // Red
  };

  const studentRows = performanceData?.students.map((student, index) => (
    <tr key={index}>
      <td>{student.name}</td>
      <td>{student.score.toFixed(2)}%</td>
      <td>
        <div style={{ width: "100%", backgroundColor: "#e6f2ff", borderRadius: "10px" }}>
          <div
            className="performance-bar"
            style={{
              width: `${student.score}%`,
              backgroundColor: getPerformanceColor(student.score),
            }}
          />
        </div>
      </td>
    </tr>
  ));

  const averageQuestionScores = performanceData?.questionPerformance.map((q, index) => (
    <tr key={index}>
      <td>Q{index + 1}</td>
      <td>{q.score.toFixed(2)}%</td>
      <td>
        <div style={{ width: "100%", backgroundColor: "#e6f2ff", borderRadius: "10px" }}>
          <div
            className="performance-bar"
            style={{
              width: `${q.score}%`,
              backgroundColor: getPerformanceColor(q.score),
            }}
          />
        </div>
      </td>
    </tr>
  ));

  return (
    <div className="dashboard-container">
      <h1>🏫 Class Performance Dashboard 📊</h1>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Enter Quiz Code"
          value={quizCode}
          onChange={(e) => setQuizCode(e.target.value)}
        />
        <button onClick={fetchQuizData}>Fetch Data</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {performanceData ? (
        <>
          <div className="statistics-summary">
            <div className="stat-card">
              <h3>Average Score</h3>
              <p>{performanceData.averageScore}%</p>
            </div>
            <div className="stat-card">
              <h3>Highest Score</h3>
              <p>{performanceData.highestScore}%</p>
            </div>
            <div className="stat-card">
              <h3>Lowest Score</h3>
              <p>{performanceData.lowestScore}%</p>
            </div>
            <div className="stat-card">
              <h3>Total Students</h3>
              <p>{performanceData.totalStudents}</p>
            </div>
          </div>

          <div>
            <h2>Question Performance (Average Score)</h2>
            <table className="student-performance-table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Average Score</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>{averageQuestionScores}</tbody>
            </table>
          </div>

          <div>
            <h2>Student Performance Details</h2>
            <table className="student-performance-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Score</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>{studentRows}</tbody>
            </table>
          </div>

         <button onClick={Report}>Export Report 📄</button>
        </>
      ) : (
        <p>Please enter a quiz code to view performance data.</p>
      )}
    </div>
  );
};

export default ClassPerf;
