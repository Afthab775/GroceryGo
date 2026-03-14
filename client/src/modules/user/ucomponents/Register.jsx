import React, { useState } from 'react'
import './auth.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import CustomSnackbar from '../../../CustomSnackbar'
import useSnackbar from '../../../useSnackbar'

export default function Register() {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const [user, setUser] = useState({
    uname: '',
    uphone: '',
    uemail: '',
    upassword: ''
  })

  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar()
  const nav = useNavigate()

  const handlechange = (e) => {
    const { name, value } = e.target

    if (name === "uphone") {
      if (!/^\d*$/.test(value)) return
      if (value.length > 10) return
    }
    setUser({ ...user, [name]: value })
  }

  const handlesubmit = () => {
    if (user.uphone.length !== 10) {
      showSnackbar("Please enter a valid 10-digit phone number", "warning")
      return
    }

    setLoading(true)

    axios.post(`${import.meta.env.VITE_API_URL}/api/user/adduser`, user)
      .then((res) => {
        console.log("User details", res.data)
        showSnackbar("Registration successful! Redirecting to login...", "success")
        setTimeout(() => {
          nav('/login')
        }, 1500)
      })
      .catch((error) => {
        console.log(error)
        showSnackbar(error.response?.data?.message || "Registration failed. Please try again.", "error")
        setLoading(false)
      })
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create an account!</h2>

        <button
          onClick={() => nav('/')}
          className="close-button"
          aria-label="Close"
          type="button"
        >
          ×
        </button>

        <form onSubmit={(e) => { e.preventDefault(); handlesubmit(); }} autoComplete="off">
          {/* Name */}
          <input
            required
            type="text"
            name="uname"
            placeholder="Name"
            onChange={handlechange}
          />

          {/* Phone */}
          <div className="phone-wrapper">
            <div className="phone-prefix">
              <img
                src="https://flagcdn.com/w20/in.png"
                alt="IN"
                className="flag-icon"
              />
              +91
            </div>
            <input
              required
              type="tel"
              name="uphone"
              placeholder="Phone Number"
              className="phone-input"
              onChange={handlechange}
              maxLength="10"
              minLength="10"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>

          {/* Email */}
          <input
            required
            type="email"
            name="uemail"
            placeholder="Email"
            onChange={handlechange}
          />

          {/* Password */}
          <div className="password-wrapper">
            <input
              required
              className="password-input"
              name="upassword"
              type={show ? "text" : "password"}
              placeholder="Password"
              onChange={handlechange}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="eye-icon"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Sign Up'}
          </button>

          <h6>
            Already have an account? <Link to="/login">Login</Link>
          </h6>
        </form>
      </div>

      {/* Snackbar */}
      <CustomSnackbar
        snackbar={snackbar}
        onClose={hideSnackbar}
      />
    </div>
  )
}