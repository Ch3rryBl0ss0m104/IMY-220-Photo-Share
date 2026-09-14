import { useState } from 'react';
import * as usersApi from '../api/users.js';
import './EditProfileForm.css';

function EditProfileForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio,
  });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const { user: updatedUser } = await usersApi.updateUser(user._id, formData);
      onSave?.(updatedUser);
    } catch (err) {
      console.error('Profile update failed:', err);
      setError(err.message || 'Could not update profile.');
      setStatus('error');
    }
  };

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit}>
      <h3>edit profile</h3>

      <div className="edit-profile-form__field">
        <label htmlFor="edit-name">name</label>
        <input id="edit-name" name="name" type="text" value={formData.name} onChange={handleChange} />
      </div>

      <div className="edit-profile-form__field">
        <label htmlFor="edit-username">username</label>
        <input id="edit-username" name="username" type="text" value={formData.username} onChange={handleChange} />
      </div>

      <div className="edit-profile-form__field">
        <label htmlFor="edit-bio">bio</label>
        <textarea id="edit-bio" name="bio" rows={3} value={formData.bio} onChange={handleChange} />
      </div>

      {error && <p className="create-post__error">{error}</p>}

      <div className="edit-profile-form__actions">
        <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'saving…' : 'save changes'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          cancel
        </button>
      </div>
    </form>
  );
}

export default EditProfileForm;
