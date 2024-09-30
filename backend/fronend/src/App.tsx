import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const serverURL = "http://localhost:3003"


const App = () => {
  const [username, setUserName] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [isLoggedin, setIsLoggedIn] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [successLogin, setSuccessLogin] = useState<string | null>(null)
  const [successSignup, setSuccessSignup] = useState<string | null>(null)

  const navigate = useNavigate()

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const formData = {
      username,
      password,
    }

    try {
      // POST request between login/signup
      const response = isLoggedin
        ? await axios.post(`${serverURL}/login`, formData)
        : await axios.post(`${serverURL}/signup`, formData)

      console.log(response.data)

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token)
      }

      // Reset form
      setUserName("")
      setPassword("")

      // Success message
      if (isLoggedin) {
        setSuccessLogin("Login successfull.")
        setTimeout(() => {
          setSuccessLogin(null)
          navigate("/authenticated")
        }, 1000);
      } else {
        setSuccessSignup("User created successfully.")
        setTimeout(() => {
          setSuccessSignup(null)
        }, 1000);
      }

    } catch (error: any) {
      console.error(error)
      setError(error.response?.data?.message || "An error occurred. Please try again.")
    }

  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value)
  }
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col justify-center items-center'>
      <div className='bg-white shadow-lg rounded-lg p-8 w-full max-w-md'>
        <header className='text-center mb-6'>
          <h1 className='text-5xl text-gray-800'>
            Auth App 🔐
          </h1>
        </header>

        <nav className='flex justify-center mb-8 space-x-4'>
          <h3 onClick={() => setIsLoggedIn(true)} className={`px-4 py-2 text-lg rounded transition-all cursor-pointer ${isLoggedin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
            Login
          </h3>
          <h3 onClick={() => setIsLoggedIn(false)} className={`px-4 py-2 text-lg rounded transition-all cursor-pointer ${!isLoggedin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
            Sign up
          </h3>
        </nav>

        <form onSubmit={handleFormSubmit} className='space-y-6'>
          <div>
            <label htmlFor="username" className='block text-sm font-medium text-gray-800 mb-2 ml-1'>
              Username
            </label>
            <input
              type='text'
              id='username'
              placeholder='HelloWUser'
              value={username}
              onChange={handleUsernameChange}
              className='block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
            />
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-800 mb-2 ml-1'>
              Password
            </label>
            <input
              type='password'
              id='password'
              placeholder='**********'
              value={password}
              onChange={handlePasswordChange}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
            />
          </div>

          <button type='submit' className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all'>
            {isLoggedin ? "Login" : "Sign Up"}
          </button>
        </form>

        {successLogin &&
          <p className='text-green-600 text-center mt-4'>
            {successLogin}
          </p>
        }

        {successSignup &&
          <p className='text-green-600 text-center mt-4'>
            {successSignup}
          </p>
        }

        {error &&
          <p className='text-red-600 text-center mt-4'>
            {error}
          </p>
        }
      </div>
    </div>
  )
}

export default App