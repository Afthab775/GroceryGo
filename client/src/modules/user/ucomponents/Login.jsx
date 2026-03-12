import React, { useState } from 'react';
import './auth.css';
import { Link, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import CustomSnackbar from '../../../CustomSnackbar';
import useSnackbar from '../../../useSnackbar';

export default function Login() {
  const [user, setUser] = useState({
    uemail: '',
    upassword: ''
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const nav = useNavigate();
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const handlechange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    console.log({ ...user, [e.target.name]: e.target.value });
  };

  const handlelogin = () => {
    setLoading(true);
    console.log("Sending login data:", user);
    
    axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, user)
      .then((res) => {
        console.log("User Details", res.data);
        if (res.data.success) {
          showSnackbar("Login successful! Redirecting...", "success");
          localStorage.setItem("usertoken", res.data.Token);
          setTimeout(() => {
            nav('/');
          }, 1500);
        } else {
          showSnackbar(res.data.message || "Login failed", "error");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        showSnackbar(error.response?.data?.message || "Server error. Please try again.", "error");
        setLoading(false);
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <form autoComplete="off" onSubmit={(e) => { e.preventDefault(); handlelogin(); }}>
          <input
            type='text'
            name='fakeusername'
            autoComplete='username'
            style={{ display: "none" }}
          />
          <input
            type='password'
            name='fakepassword'
            autoComplete='new-password'
            style={{ display: "none" }}
          />
          
          <input
            type="email"
            name='uemail'
            onChange={handlechange}
            placeholder="Email"
            autoComplete='off'
            required
          />
          
          <div className='password-wrapper'>
            <input
              className='password-input'
              name='upassword'
              onChange={handlechange}
              type={show ? "text" : "password"}
              placeholder="Password"
              autoComplete='new-password'
              required
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
          
          <button type='submit' disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <h6>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </h6>
        </form>
      </div>

      {/* Snackbar */}
      <CustomSnackbar
        snackbar={snackbar}
        onClose={hideSnackbar}
      />
    </div>
  );
}