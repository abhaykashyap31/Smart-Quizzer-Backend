import React, { useState } from 'react';
import './SignLogin.css';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Auth, db } from '../Firebase/firebaseAuth';
import { doc, setDoc } from 'firebase/firestore';

const SignupLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPswd] = useState('');
  const [Name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [roll, setRoll] = useState('');
  const [profile, setProfile] = useState('');
  const [Department, setDept] = useState('');
  const [gender, setGen] = useState('');
  const [role, setRole] = useState('');
  const [isdCode, setIsdCode] = useState('+91');

  const handleDepartmentChange = (event) => {
    setDept(event.target.value);
  };

  const handleGenderChange = (event) => {
    setGen(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(phone)) {
      alert('Phone number must be exactly 10 digits.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(Auth, email, password);
      const user = Auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, 'Users', user.uid), {
          email: user.email,
          Username: Name,
          UserProfile: profile,
          Telephone: `${isdCode} ${phone}`, 
          rolnum: roll,
          depart: Department,
          gen: gender,
          Role: role,
        });
      }
      alert('User successfully registered');
    } catch (error) {
      alert(error.message);
      setEmail('');
      setName('');
      setDept('');
      setPswd('');
      setRoll('');
      setPhone('');
      setProfile('');
    }
  };

  return (
    <div className="container">
      <div className="toggle-buttons">
        <button className="toggle-btn" onClick={() => navigate('/')}>
          SIGNUP
        </button>
        <button className="toggle-btn" onClick={() => navigate('/login')}>
          LOGIN
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={handleRegister} className="signup-form active">
          <h2 className="form-title">Smart Quizzer Signup</h2>
          <input
            type="name"
            placeholder="Full Name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="roll number"
            placeholder="Roll/Faculty Number"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            required
          />

          {/* ISD Code Dropdown */}
          <div className="phone-input">
            <select value={isdCode} onChange={(e) => setIsdCode(e.target.value)} required>
              <option value="+91">+91 (India)</option>
              <option value="+1">+1 (USA)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+61">+61 (Australia)</option>
              <option value="+81">+81 (Japan)</option>
            </select>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPswd(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Profile Picture Link"
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
          />

          <select value={Department} onChange={handleDepartmentChange} required>
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Engineering">Engineering</option>
            <option value="Arts">Arts</option>
            <option value="Science">Science</option>
          </select>

          <select value={gender} onChange={handleGenderChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="other">Other</option>
          </select>

          <select value={role} onChange={handleRoleChange} required>
            <option value="">Select Role</option>
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
          </select>

          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default SignupLogin;
