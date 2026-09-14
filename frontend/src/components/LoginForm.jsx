import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import './AuthForm.css';

function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [serverError, setServerError] = useState('');

  const validate = (data) => {
    const nextErrors = {};

    if (!data.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!data.password) {
      nextErrors.password = 'Password is required.';
    } else if (data.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextData = { ...formData, [name]: value };
    setFormData(nextData);
    setErrors(validate(nextData));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus('loading');
    setServerError('');
    try {
      const data = await authApi.signin(formData);
      setUser(data.user);
      setStatus('success');
      navigate('/home');
    } catch (error) {
      console.error('Sign-in request failed:', error);
      setServerError(error.message || 'Something went wrong. Try again.');
      setStatus('error');
    }
  };

  const isValid = Object.keys(validate(formData)).length === 0;

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="auth-form__field">
        <label htmlFor="login-email">email</label>
        <input
          id="login-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
        />
        {errors.email && (
          <p id="login-email-error" className="auth-form__error">
            {errors.email}
          </p>
        )}
      </div>

      <div className="auth-form__field">
        <label htmlFor="login-password">password</label>
        <input
          id="login-password"
          name="password"
          type="password"
          placeholder="••••••••••"
          value={formData.password}
          onChange={handleChange}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'login-password-error' : undefined}
        />
        {errors.password && (
          <p id="login-password-error" className="auth-form__error">
            {errors.password}
          </p>
        )}
      </div>

      <button type="submit" className="btn btn-primary auth-form__submit" disabled={!isValid || status === 'loading'}>
        {status === 'loading' ? 'signing in…' : "let's go →"}
      </button>
      {status === 'error' && <p className="auth-form__error">{serverError}</p>}
    </form>
  );
}

export default LoginForm;
