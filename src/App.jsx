import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DoctorPage from './pages/DoctorPage'
import PatientPage from './pages/PatientPage'
import SignupPage from './pages/SignUpPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />

        <Route path='/doctor-dashboard' element={
          <ProtectedRoute>
            <DoctorPage />
          </ProtectedRoute>
        } />

        <Route path='/patient-dashboard' element={
          <ProtectedRoute>
            <PatientPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
