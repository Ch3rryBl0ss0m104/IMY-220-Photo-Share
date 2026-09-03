import { useState } from 'react';
import './EditProfileForm.css';

function EditProfileForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Profile update (dummy submit):', formData);
    onSave?.(formData);
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

      <div className="edit-profile-form__actions">
        <button type="submit" className="btn btn-primary">
          save changes
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          cancel
        </button>
      </div>
    </form>
  );
}

export default EditProfileForm;
