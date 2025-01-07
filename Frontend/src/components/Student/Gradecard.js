import React, { useEffect,useRef, useState,useCallback } from "react";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Auth,db } from "../Firebase/firebaseAuth"; // Firebase Auth import
import { doc, getDoc } from "firebase/firestore"; // Firestore imports
import "./Gradecard.css";

const GradeCard = () => {
  const [quizCode, setQuizCode] = useState("");
  const [inputQuizCode, setInputQuizCode] = useState("");
  const [performanceData, setPerformanceData] = useState(null);
  const [error, setError] = useState(null);
  const [rollnum, setRollnum] = useState(null);
  const chartRef = useRef(null);


  useEffect(() => {
    const fetchRollnum = async () => {
      try {
        const user = Auth.currentUser;
        if (!user) throw new Error("User not authenticated!");

        const userDocRef = doc(db, "Users", user.uid); // Replace 'users' with your Firestore collection
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setRollnum(userDoc.data().rolnum);
        } else {
          throw new Error("User roll number not found in Firestore.");
        }
      } catch (err) {
        console.error("Error fetching roll number:", err);
        setError(err.message);
      }
    };

    fetchRollnum();
  }, []);

  const fetchPerformanceData = useCallback(async (quizCode, rollnum) => {
    try {
      const response = await fetch(`http://localhost:5000/api/grades/${quizCode}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
  
      if (!data.grades || data.grades.length === 0) {
        throw new Error("No grades data found.");
      }
  
      // Debugging: Log the values to check what's being compared
      console.log("Comparing quizCode:", quizCode, "with data.grades[0].quizCode:", data.grades[0].quizCode);
      console.log("Comparing rollnum:", rollnum, "with data.grades[0].studentUserId:", data.grades[0].studentUserId);
  
      // Trim and compare values
      const cleanedQuizCode = quizCode.trim();
      const cleanedRollnum = rollnum.trim();
  
      const matchingGrade = data.grades.find(
        (grade) => grade.quizCode === cleanedQuizCode && grade.studentUserId === cleanedRollnum
      );
  
      if (!matchingGrade) {
        console.error("No matching grades found.");
        throw new Error("No matching grades found.");
      }
  
      console.log("Matching Grade:", matchingGrade);
  
      return {
        totalScore: ((matchingGrade.obtainedMarks / matchingGrade.totalMarks) * 100).toFixed(2),
        timeUsed: "N/A", // Add if time data exists
        quizCode: matchingGrade.quizCode,
        studentUserId: matchingGrade.studentUserId,
        questionPerformance: matchingGrade.results.map((result, index) => ({
          question: result.question || `Question ${index + 1}`,
          score: ((result.marksObtained / result.totalMarks) * 100).toFixed(2),
          correctAnswer: result.correctAnswer,
          studentAnswer: result.studentAnswer,
          totalMarks: result.totalMarks,
        })),
      };
    } catch (err) {
      console.error("Error fetching performance data:", err);
      throw new Error(err.message);
    }
  }, []); 
  
  useEffect(() => {
    if (quizCode && rollnum) {
      const getPerformanceData = async () => {
        try {
          const performance = await fetchPerformanceData(quizCode, rollnum);
          setPerformanceData(performance);
          setError(null);
        } catch (err) {
          setError(err.message);
          setPerformanceData(null);
        }
      };
  
      getPerformanceData();
      console.log(performance);
    }
  }, [quizCode, rollnum, fetchPerformanceData]); 
  

  const downloadReport = () => {
    if (!performanceData) return;

    const doc = new jsPDF();

    // Set Font and Heading
    doc.setFont("Georgia", "bold");
    doc.setFontSize(16);
    doc.text(`Quiz Performance Report`, 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Quiz Code: ${performanceData.quizCode}`, 20, 40);
    doc.text(`Roll Number: ${performanceData.studentUserId}`, 20, 60);
    doc.text(`Total Score: ${performanceData.totalScore}%`, 20, 70);

    // Table for Questions and Answers
    const tableRows = performanceData.questionPerformance.map((item, index) => [
      index + 1,
      item.question,
      item.correctAnswer,
      item.studentAnswer,
      `${item.score}%`,
      item.totalMarks,
    ]);

    doc.autoTable({
      startY: 80,
      head: [["#", "Question", "Correct Answer", "Student Answer", "Score", "Total Marks"]],
      body: tableRows,
      styles: { font: "Georgia" },
      headStyles: { fillColor: [78, 205, 196] },
    });

    // Save as PDF
    doc.save(`Quiz_Report_${performanceData.quizCode}.pdf`);
  };

  useEffect(() => {
    if (performanceData) {
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
    }
  }, [performanceData]);

  const getColorForScore = (score) => {
    if (score >= 80) return "#2ecc71"; // Green for high performance
    if (score >= 60) return "#f39c12"; // Orange for medium performance
    return "#e74c3c"; // Red for low performance
  };

  const handleFetchData = () => {
    setQuizCode(inputQuizCode);
  };

  if (!quizCode) {
    return (
      <div className="input-container">
        <h1>Enter Quiz Code</h1>
        <input
          type="text"
          placeholder="Enter quiz code"
          value={inputQuizCode}
          onChange={(e) => setInputQuizCode(e.target.value)}
          maxLength={16}
        />
        <button onClick={handleFetchData}>Fetch Performance</button>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => setQuizCode("")}>Retry</button>
      </div>
    );
  }

  if (!performanceData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="performance-container">
      <h1>🌟 My Quiz Performance 📊</h1>

      <div className="performance-summary">
        <div className="summary-card">
          <h3>Total Score</h3>
          <p id="totalScore">{performanceData.totalScore}%</p>
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
      <button onClick={() => downloadReport()} className="download">Download Report</button>
      <button onClick={() => setQuizCode("")}>Enter Another Quiz Code</button>
    </div>
  );
};

export default GradeCard;
