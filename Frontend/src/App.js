import './App.css';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import TeacherQuiz from './components/Teacher/Teachquiz';
import StudentQuiz from './components/Student/Stuquiz';
import GradeCard from './components/Student/Gradecard';
import ClassPerf from './components/Teacher/ClassPerf';
import Signup from './components/Sign-Login/SignLogin';
import Login from './components/Sign-Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Feedback from './components/Feedback/feedback';
import Notifs from './components/Notifs/Notif';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Signup/>} />
      <Route path="/home" element={<Dashboard/>} />
      <Route path="/feedback" element={<Feedback/>} />
      <Route path="/notifications" element={<Notifs/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/create-quiz" element={<TeacherQuiz/>} />
      <Route path="/give-quiz" element={<StudentQuiz/>}/>
      <Route path="/gradecard" element={<GradeCard/>} />
      <Route path="/class-performance" element={<ClassPerf/>}/>
    </Routes>
    </Router>
  );
}

export default App;
