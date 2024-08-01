import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserRegistration } from './components/UserRegistration'
import { UserLogin } from './components/UserLogin'
function App() {
  return (
    <Router>
            <Routes>
              <Route exact path="/" element={<UserLogin/>} />
              <Route path="/sign-up" element={<UserRegistration />} />
              <Route path="/login" element={<UserLogin />} />
            </Routes>
    </Router>
  )
}
export default App