import React, { useState } from 'react';
import './Dashboard.css'; // Import the CSS file

const Dashboard = () => {
  const [role, setRole] = useState('student');
  const [profile, setProfile] = useState({
    name: 'John Doe',
    role: 'Student',
    department: 'Computer Science',
    id: 'CS2024001',
    email: 'john.doe@example.com'
  });

  const toggleRole = () => {
    const newRole = role === 'student' ? 'teacher' : 'student';
    setRole(newRole);

    if (newRole === 'teacher') {
      setProfile({
        name: 'Jane Smith',
        role: 'Teacher',
        department: 'Computer Science',
        id: 'CSFT2024',
        email: 'jane.smith@example.com'
      });
    } else {
      setProfile({
        name: 'John Doe',
        role: 'Student',
        department: 'Computer Science',
        id: 'CS2024001',
        email: 'john.doe@example.com'
      });
    }
  };

  return (
    <div className="main-content" data-role={role}>
      <div className="profile-header">
        <img src="/api/placeholder/100/100" alt="Profile Picture" className="profile-picture" />
        <div className="profile-details">
          <h1>{profile.name}</h1>
          <p><strong>Role:</strong> {profile.role}</p>
          <p><strong>Department:</strong> {profile.department}</p>
          <p><strong>{profile.role === 'Student' ? 'Roll' : 'Faculty'} Number:</strong> {profile.id}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {role === 'teacher' && (
          <>
            <div className="dashboard-card">
              <i className="fas fa-plus-circle"></i>
              <h3>Create Quiz</h3>
              <p>Design and set up new quizzes for your students</p>
            </div>
            <div className="dashboard-card">
              <i className="fas fa-chalkboard-teacher"></i>
              <h3>Class Performance</h3>
              <p>Check overall class performance and rankings</p>
            </div>
          </>
        )}

        {role === 'student' && (
          <>
            <div className="dashboard-card">
              <i className="fas fa-pencil-alt"></i>
              <h3>Take Quiz</h3>
              <p>Start a new quiz or continue a pending one</p>
            </div>
            <div className="dashboard-card">
              <i className="fas fa-chart-bar"></i>
              <h3>My Grades</h3>
              <p>View your quiz scores and performance history</p>
            </div>
          </>
        )}
      </div>

      <div className="logout-section">
        <button className="logout-btn" onClick={toggleRole}>
          <i className="fas fa-sign-out-alt"></i>
          Toggle Role (Press 'R' to switch)
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
