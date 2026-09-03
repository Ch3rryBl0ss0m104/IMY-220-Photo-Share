import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const initialData = { name: '', email: '', password: '', confirmPassword: '' };

function SignupForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const validate = (data) => {
    const nextErrors = {};

    if (!data.name.trim()) {
      nextErrors.name = 'Name is required.';
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
    try {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('Sign-up response (stubbed):', data);
      setStatus('success');
      // A new account is automatically logged in.
      navigate('/home');
    } catch (error) {
      console.error('Sign-up request failed:', error);
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
      {status === 'error' && <p className="auth-form__error">Something went wrong. Try again.</p>}
    </form>
  );
}

export default SignupForm;
