import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignLogin.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Auth } from '../Firebase/firebaseAuth';

const Login = () => {
const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try{
      await signInWithEmailAndPassword(Auth,email,password);
      alert("Login Successful");
      navigate('/home');
    }catch(error){
    alert(error.message);

    }
  };
  return (
    <div className="container">
      <div className="toggle-buttons">
        <button
          className="toggle-btn"
          onClick={() => navigate('/')}
        >
          SIGNUP
        </button>
        <button
          className="toggle-btn"
          onClick={() => navigate('/login')}
        >
          LOGIN
        </button>
      </div>

      <div className="form-container">
      <form onSubmit={handleLoginSubmit} className="signup-form active">
          <h2 className="form-title">Smart Quizzer Login</h2>
          <input type="email" value={email} placeholder="Email Address" onChange={(e)=>setEmail(e.target.value)} required />
          <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
