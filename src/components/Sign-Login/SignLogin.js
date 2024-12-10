import React, { useState } from 'react';
import './SignLogin.css';

const SignupLogin = () => {
  const [isSignup, setIsSignup] = useState(true);

  const toggleForm = (formType) => {
    setIsSignup(formType === 'signup');
  };

  return (
    <div className="container">
      <div className="toggle-buttons">
        <button
          className={`toggle-btn ${isSignup ? 'active' : ''}`}
          onClick={() => toggleForm('signup')}
        >
          Signup
        </button>
        <button
          className={`toggle-btn ${!isSignup ? 'active' : ''}`}
          onClick={() => toggleForm('login')}
        >
          Login
        </button>
      </div>

      <div className="form-container">
        {isSignup ? (
          <form className="signup-form active">
            <h2 className="form-title">Quiz App Signup</h2>
            <input type="text" placeholder="Full Name" required />
            <input type="text" placeholder="Roll/Faculty Number" required />
            <input type="tel" placeholder="Phone Number" required />
            <input type="email" placeholder="Email Address" required />
            <input type="password" placeholder="Password" required />
            <input type="file" placeholder="Profile Picture" />

            <select required>
              <option value="">Select Department</option>
              <option value="computer_science">Computer Science</option>
              <option value="engineering">Engineering</option>
              <option value="arts">Arts</option>
              <option value="science">Science</option>
            </select>

            <select required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <select required>
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>

            <button type="submit">Create Account</button>
          </form>
        ) : (
          <form className="login-form">
            <h2 className="form-title">Quiz App Login</h2>
            <input type="email" placeholder="Email Address" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignupLogin;
