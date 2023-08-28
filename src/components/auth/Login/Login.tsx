import React, { useEffect, useRef, useState } from "react";
import { TextField, Button, Typography, Stack, Snackbar, Alert } from "@mui/material";
import "./login.css";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/ProsperFleet.png"
import { login } from "../../../services/authentication";


interface ValidationErrors {
  username: string;
  password: string;
}


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isSnackbar, setIsSnackbar] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');
  const usernameInputRef = useRef<HTMLInputElement | null>(null);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    username: '',
    password: '',
  });
  useEffect(() => {
    if (usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, []);
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleCloseSnackbar = () => {
    setIsSnackbar(false);
  };

  const validateFormAsync = () => {
    return new Promise<void>((resolve, reject) => {
      const newValidationErrors: ValidationErrors = {
        username: username.trim() === '' ? 'Username is required.' : '',
        password: password.trim() === '' ? 'Password is required.' : '',
      };

      setValidationErrors(newValidationErrors);

      const isFormValid =
        newValidationErrors.username === '' && newValidationErrors.password === '';

      if (isFormValid) {
        resolve(); // Resolve the promise if the form is valid
      } else {
        reject(newValidationErrors); // Reject the promise with validation errors
      }
    });
  };
  const handleLogin = async () => {
    try {
      await validateFormAsync(); // Validate the form using the promise
      const response = await login(username, password);

      if (response.status === "OK") {
        setMessage("Login successful");
        setSeverity('success');
        setIsSnackbar(true);
        const userToken = response.result.userToken;
        // Store the user token in localStorage
        localStorage.setItem("userToken", userToken);

        // Redirect to the dashboard or other protected route
        navigate("/subscribers"); // Replace with your route
      } else {
        setSeverity('error');
        setMessage("Login failed. Please check your credentials.");
        setIsSnackbar(true);
      }
    } catch (error) {
      setSeverity('error');
      setMessage("An error occurred. Please try again.");
      setIsSnackbar(true);
    }
  };

  return (
    <>
      <div className="fixed-background">
        <div className="login-form">
          <div className="login-form-box">
            <img src={logo} alt="logo" />
            <div className="login-form-header">
              <Typography variant="h2">Login</Typography>
            </div>
            <form action="">
              <div className="input-item">
                <TextField fullWidth variant="outlined" label="User Name" value={username}
                  onChange={handleUsernameChange}
                  ref={usernameInputRef}
                  error={!!validationErrors.username}
                  helperText={validationErrors.username} />
              </div>
              <div className="input-item">
                <TextField
                  fullWidth
                  type="password"
                  variant="outlined"
                  label="Password" value={password}
                  onChange={handlePasswordChange}
                  error={!!validationErrors.password}
                  helperText={validationErrors.password}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); 
                      handleLogin(); 
                    }
                  }}
                />
              </div>
              <Stack spacing={2} direction="row" justifyContent="flex-end">
                <Button className="btn login-btn" onClick={handleLogin}> Login</Button>
              </Stack>
            </form>
          </div>
        </div>
      </div>
      <Snackbar open={isSnackbar} autoHideDuration={1000} onClose={handleCloseSnackbar} anchorOrigin={{vertical: 'top', horizontal: 'right'} }>
        <Alert onClose={handleCloseSnackbar} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
