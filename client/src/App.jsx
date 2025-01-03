import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignIn from './Pages/SignIn.jsx'
import SignUp from './Pages/SignUp.jsx'
import Dashboard from './Pages/Dashboard.jsx'
import { Navigate } from 'react-router-dom';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} /> 
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
    </>
  );
}

export default App
