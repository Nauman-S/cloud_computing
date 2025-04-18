import { useState } from 'react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    errors: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      errors: { ...prevState.errors, [name]: '' }, // Clear error on change
    }));
  };

  // Validate form fields
  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;
    let formErrors = {};

    // Validate name
    if (!name) formErrors.name = 'Name is required';

    // Validate email
    if (!email) formErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) formErrors.email = 'Email is invalid';

    // Validate password
    if (!password) formErrors.password = 'Password is required';
    else if (password.length < 6) formErrors.password = 'Password must be at least 6 characters long';

    // Validate confirm password
    if (!confirmPassword) formErrors.confirmPassword = 'Confirm password is required';
    else if (confirmPassword !== password) formErrors.confirmPassword = 'Passwords do not match';

    setFormData((prevState) => ({
      ...prevState,
      errors: formErrors,
    }));

    return Object.keys(formErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('SignUp successful');
      // Perform sign-up logic (e.g., API call)
    } else {
      console.log('Form has errors');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name</label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {formData.errors.name && <div className="text-danger">{formData.errors.name}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {formData.errors.email && <div className="text-danger">{formData.errors.email}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {formData.errors.password && <div className="text-danger">{formData.errors.password}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
        <input
          type="password"
          className="form-control"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {formData.errors.confirmPassword && <div className="text-danger">{formData.errors.confirmPassword}</div>}
      </div>

      <button type="submit" className="btn btn-primary">Sign Up</button>
    </form>
  );
};

export default SignUp;
