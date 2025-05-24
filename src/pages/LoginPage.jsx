import React from 'react'
import LoginForm from '../components/LoginForm'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const LoginPage = () => {
  const role = useSelector((state) => state.auth.role)
  const token = useSelector((state) => state.auth.token)

  if (token) {
    if (role === 'doctor') {
      return <Navigate to='/doctor-dashboard' />
    } else if (role === 'patient') {
      return <Navigate to='/patient-dashboard' />
    }
  }
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <LoginForm />
    </div>
  )
}

export default LoginPage