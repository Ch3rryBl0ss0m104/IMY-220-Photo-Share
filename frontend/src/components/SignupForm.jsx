import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import './AuthForm.css';

const initialData = { name: '', username: '', email: '', password: '', confirmPassword: '' };

function SignupForm() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [serverError, setServerError] = useState('');

  const validate = (data) => {
    const nextErrors = {};

    if (!data.name.trim()) {
      nextErrors.name = 'Name is required.';
    }

    if (!data.username.trim()) {
      nextErrors.username = 'Username is required.';
    } else if (!/^[a-z0-9._]+$/i.test(data.username)) {
      nextErrors.username = 'Letters, numbers, dots, and underscores only.';
    }

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

    if (!data.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (data.confirmPassword !== data.password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
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
      const { confirmPassword: _confirmPassword, ...payload } = formData;
      const data = await authApi.signup(payload);
      setUser(data.user);
      setStatus('success');
      // A new account is automatically logged in, per the usability requirement.
      navigate('/home');
    } catch (error) {
      console.error('Sign-up request failed:', error);
      setServerError(error.message || 'Something went wrong. Try again.');
      setStatus('error');
    }
  };

  const isValid = Object.keys(validate(formData)).length === 0;

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="auth-form__field">
        <label htmlFor="signup-name">name</label>
        <input
          id="signup-name"
          name="name"
          type="text"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <p className="auth-form__error">{errors.name}</p>}
      </div>

      <div className="auth-form__field">
        <label htmlFor="signup-username">username</label>
        <input
          id="signup-username"
          name="username"
          type="text"
          placeholder="yourname"
          value={formData.username}
          onChange={handleChange}
          aria-invalid={Boolean(errors.username)}
        />
        {errors.username && <p className="auth-form__error">{errors.username}</p>}
      </div>

      <div className="auth-form__field">
        <label htmlFor="signup-email">email</label>
        <input
          id="signup-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && <p className="auth-form__error">{errors.email}</p>}
      </div>

      <div className="auth-form__field">
        <label htmlFor="signup-password">password</label>
        <input
          id="signup-password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          value={formData.password}
          onChange={handleChange}
          aria-invalid={Boolean(errors.password)}
        />
        {errors.password && <p className="auth-form__error">{errors.password}</p>}
      </div>

      <div className="auth-form__field">
        <label htmlFor="signup-confirm-password">confirm password</label>
        <input
          id="signup-confirm-password"
          name="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          aria-invalid={Boolean(errors.confirmPassword)}
        />
        {errors.confirmPassword && <p className="auth-form__error">{errors.confirmPassword}</p>}
      </div>

      <button type="submit" className="btn btn-primary auth-form__submit" disabled={!isValid || status === 'loading'}>
        {status === 'loading' ? 'creating account…' : 'sign up'}
      </button>
      {status === 'error' && <p className="auth-form__error">{serverError}</p>}
    </form>
  );
}

export default SignupForm;
