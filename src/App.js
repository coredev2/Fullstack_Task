import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserRegistration } from './components/UserRegistration'
import { UserLogin } from './components/UserLogin'
import Bar from './components/BarChart'

const App = () => {
  return (
    <Router>
          <Routes>
          {/* Public Routes */}
          <Route exact path="/" element={<UserRegistration/>} />
          <Route path="/sign-up" element={ <UserRegistration />} />
          <Route path="/login" element={<UserLogin/> } />

          {/* Protected Routes */}
          <Route
            path="/barchart"
            element={< Bar />}
          />
        </Routes>
    </Router>
  )
}
export default App