import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { Auth, db } from '../Firebase/firebaseAuth';
import { doc, getDoc } from "firebase/firestore";

const Dashboard = () => {
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    name: '',
    role: '',
    department: '',
    id: '',
    email: '',
    UserProfile: '',
  });

  const fetchUserData = async () => {
    Auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docsnap = await getDoc(docRef);
        if (docsnap.exists()) {
          const userData = docsnap.data();
          setUserDetails({
            name: userData.Username || '',
            role: userData.Role || 'student',
            department: userData.depart || '',
            id: userData.rolnum || '',
            email: userData.email || '',
            UserProfile: userData.UserProfile || '', // Use user profile or empty string initially
          });
          setRole(userData.Role === 'Teacher' ? 'teacher' : 'student');
        } else {
          alert("User data not found!");
        }
      } else {
        alert("User is not logged in!");
        navigate('/login');
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      alert("User logged out");
      navigate('/login');
    } catch (error) {
      alert(error.message);
    }
  };

  const defaultImage = 'https://th.bing.com/th/id/OIP.7FO8l31dPc5A-XXzHQYl-wAAAA?rs=1&pid=ImgDetMain'; // Replace with your default image path

  return (
    <div className="main-content" data-role={role}>
      <div className="profile-header">
        <img
          src={userDetails.UserProfile || defaultImage} // Use UserProfile or default
          alt="Profile"
          className="profile-picture"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = defaultImage; // Set fallback image
          }}
        />
        <div className="profile-details">
          <h1>{userDetails.name}</h1>
          <p><strong>Role:</strong> {userDetails.role}</p>
          <p><strong>Department:</strong> {userDetails.department}</p>
          <p><strong>{userDetails.role === 'Student' ? 'Roll' : 'Faculty'} Number:</strong> {userDetails.id}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {role === 'teacher' && (
          <>
            <div className="dashboard-card" onClick={() => navigate('/create-quiz')}>
              <span role="img" aria-label="plus">➕</span>
              <h3>Create Quiz</h3>
              <p>Design and set up new quizzes for your students</p>
            </div>
            <div className="dashboard-card" onClick={() => navigate('/class-performance')}>
              <span role="img" aria-label="teacher">👩‍🏫</span>
              <h3>Class Performance</h3>
              <p>Check overall class performance and rankings</p>
            </div>
            <div className="dashboard-card" onClick={() => navigate('/notifications')}>
              <span role="img" aria-label="chart">🔔</span>
              <h3>Notifications</h3>
              <p>Look if you have new messages!</p>
            </div>
            <div className="dashboard-card" onClick={() => navigate('/feedback')}>
              <span role="img" aria-label="chart">💬</span>
              <h3>Feedback Form</h3>
              <p>Share Feedback to Students or clear doubts</p>
            </div>
          </>
        )}

        {role === 'student' && (
          <>
            <div className="dashboard-card" onClick={() => navigate('/give-quiz')}>
              <span role="img" aria-label="pencil">👓</span>
              <h3>Guidelines</h3>
              <p>Have a look before you start with quiz</p>
            </div>
            <div className="dashboard-card" onClick={() => navigate('/give-quiz')}>
              <span role="img" aria-label="pencil">✏️</span>
              <h3>Take Quiz</h3>
              <p>Start a new quiz or continue a pending one</p>
            </div>
            <div className="dashboard-card" onClick={() => navigate('/gradecard')}>
              <span role="img" aria-label="chart">📊</span>
              <h3>My Grades</h3>
              <p>View your quiz scores and performance history</p>
            </div>
            <div className="dashboard-card" onClick={() => navigate('/notifications')}>
              <span role="img" aria-label="chart">🔔</span>
              <h3>Notifications</h3>
              <p>Look if you have new messages!</p>
            </div>
            <div className="dashboard-card" onClick={() => navigate('/feedback')}>
              <span role="img" aria-label="chart">💬</span>
              <h3>Feedback Form</h3>
              <p>Clear Doubts or give Feedbacks</p>
            </div>
          </>
        )}
      </div>

      <div className="logout-section">
        <button className="logout-btn" onClick={handleLogout}>
          <span role="img" aria-label="logout">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
