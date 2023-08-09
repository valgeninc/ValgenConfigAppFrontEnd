import React, { useState } from "react";
import { TextField, Button, Typography, Stack } from "@mui/material";
import "./login.css";
import { useNavigate } from "react-router-dom";

interface ValidationErrors {
  username: string;
  password: string;
}

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    username: '',
    password: '',
  });
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const validateForm = () => {
    const newValidationErrors: ValidationErrors = {
      username: username.trim() === '' ? 'Username is required.' : '',
      password: password.trim() === '' ? 'Password is required.' : '',
    };

    setValidationErrors(newValidationErrors);
    setIsFormValid(
      newValidationErrors.username === '' && newValidationErrors.password === ''
    );
  };

  const Login = (event: React.FormEvent) => {
    event.preventDefault();
    validateForm();
    if (isFormValid) {
      navigate("/subscribers");
    }
  };
  return (
    <div className="login-form">
      <div className="login-form-box">
        <div className="login-form-header">
          <Typography variant="h2">Login</Typography>
        </div>
        <form action="">
          <div className="input-item">
            <TextField fullWidth variant="outlined" label="User Name" value={username}
              onChange={handleUsernameChange}
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
            />
          </div>
          <Stack spacing={2} direction="row">
            <Button variant="contained" color="primary" onClick={Login}> OK</Button>
            <Button variant="outlined" color="primary"> CANCEL</Button>
          </Stack>
        </form>
      </div>
    </div>
  );
};

export default Login;
