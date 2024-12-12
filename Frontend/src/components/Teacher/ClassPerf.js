import React, { useEffect, useMemo, useRef } from "react";
import "./Classperf.css";

const ClassPerf = () => {
  const performanceData = useMemo(() => ({
    averageScore: 75.4,
    highestScore: 95,
    lowestScore: 45,
    totalStudents: 25,
    students: [
      { name: 'Emma Johnson', score: 92, time: '28:45' },
      { name: 'Liam Smith', score: 88, time: '29:15' },
      { name: 'Olivia Brown', score: 76, time: '27:30' },
      { name: 'Noah Davis', score: 65, time: '25:50' },
      { name: 'Ava Wilson', score: 82, time: '26:40' },
    ],
    scoreDistribution: [10, 5, 4, 3, 3],
    questionPerformance: [90, 75, 68, 82, 60], // Scores for each question
  }), []);

  // Performance color function
  const getPerformanceColor = (score) => {
    if (score >= 80) return '#2ecc71';  // Green
    if (score >= 60) return '#f39c12';  // Orange
    return '#e74c3c';  // Red
  };

  const studentRows = performanceData.students.map((student, index) => (
    <tr key={index}>
      <td>{student.name}</td>
      <td>{student.score}%</td>
      <td>
        <div style={{ width: '100%', backgroundColor: '#e6f2ff', borderRadius: '10px' }}>
          <div
            className="performance-bar"
            style={{
              width: `${student.score}%`,
              backgroundColor: getPerformanceColor(student.score),
            }}
          />
        </div>
      </td>
      <td>{student.time}</td>
    </tr>
  ));

  const averageQuestionScores = performanceData.questionPerformance.map((score, index) => (
    <tr key={index}>
      <td>Q{index + 1}</td>
      <td>{score}%</td>
      <td>
        <div style={{ width: '100%', backgroundColor: '#e6f2ff', borderRadius: '10px' }}>
          <div
            className="performance-bar"
            style={{
              width: `${score}%`,
              backgroundColor: getPerformanceColor(score),
            }}
          />
        </div>
      </td>
    </tr>
  ));

  const exportReport = () => {
    alert('Performance report would be downloaded or shared here!');
  };

  return (
    <div className="dashboard-container">
      <h1>🏫 Class Performance Dashboard 📊</h1>

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

      <div className="filter-section">
        <select>
          <option>MATH2024SPRING Quiz</option>
          <option>Science Mid-Term</option>
          <option>History Quiz</option>
        </select>
        <button onClick={exportReport}>Export Report 📄</button>
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
          <tbody>
            {averageQuestionScores}
          </tbody>
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
              <th>Time Used</th>
            </tr>
          </thead>
          <tbody>
            {studentRows}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassPerf;
