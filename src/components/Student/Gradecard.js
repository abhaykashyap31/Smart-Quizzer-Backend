import React, { useEffect, useMemo, useRef } from "react";
import Chart from "chart.js/auto";
import "./Gradecard.css";

const GradeCard = () => {
  const performanceData = useMemo(() => ({
    totalScore: 78,
    timeUsed: "25:30",
    quizCode: "MATH2024SPRING",
    questionPerformance: [
      { question: "What is the capital of France?", score: 90 },
      { question: "Explain photosynthesis", score: 65 },
      { question: "Solve 2x + 5 = 15", score: 80 },
      { question: "Describe Newton's Laws", score: 75 },
      { question: "Analyze a historical event", score: 70 },
    ],
  }), []);

  const chartRef = useRef(null);

  useEffect(() => {
    // Destroy the existing chart if any before creating a new one
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById("performanceChart").getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels: performanceData.questionPerformance.map(
          (_, index) => `Question ${index + 1}`
        ),
        datasets: [
          {
            label: "Performance",
            data: performanceData.questionPerformance.map((q) => q.score),
            fill: true,
            backgroundColor: "rgba(78, 205, 196, 0.2)",
            borderColor: "#4ecdc4",
            pointBackgroundColor: "#4ecdc4",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#4ecdc4",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          r: {
            angleLines: {
              color: "rgba(0, 0, 0, 0.1)",
            },
            grid: {
              color: "rgba(0, 0, 0, 0.1)",
            },
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
      },
    });

    // Cleanup function to destroy the chart when component unmounts or performanceData changes
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [performanceData]);

  const getColorForScore = (score) => {
    if (score >= 80) return "#2ecc71"; // Green for high performance
    if (score >= 60) return "#f39c12"; // Orange for medium performance
    return "#e74c3c"; // Red for low performance
  };

  const downloadReport = () => {
    alert("Full performance report would be downloaded here!");
  };

  return (
    <div className="performance-container">
      <h1>🌟 My Quiz Performance 📊</h1>

      <div className="performance-summary">
        <div className="summary-card">
          <h3>Total Score</h3>
          <p id="totalScore">{performanceData.totalScore}%</p>
        </div>
        <div className="summary-card">
          <h3>Time Used</h3>
          <p id="timeUsed">{performanceData.timeUsed}</p>
        </div>
        <div className="summary-card">
          <h3>Quiz Code</h3>
          <p id="quizCode">{performanceData.quizCode}</p>
        </div>
      </div>

      <div className="chart-container">
        <canvas id="performanceChart"></canvas>
      </div>

      <div className="detailed-breakdown">
        <h2>Question Performance 📝</h2>
        <div id="questionPerformances">
          {performanceData.questionPerformance.map((item, index) => (
            <div key={index} className="question-performance">
              <span style={{ width: "60%" }}>{item.question}</span>
              <div
                style={{
                  width: "30%",
                  backgroundColor: "#e6f2ff",
                  borderRadius: "10px",
                }}
              >
                <div
                  className="performance-bar"
                  style={{
                    width: `${item.score}%`,
                    backgroundColor: getColorForScore(item.score),
                  }}
                ></div>
              </div>
              <span>{item.score}%</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={downloadReport}>Download Full Report</button>
    </div>
  );
};

export default GradeCard;
