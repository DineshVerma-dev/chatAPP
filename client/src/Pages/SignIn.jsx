import React, { useState } from 'react';

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    validateInput(name, value);
  };

  const validateInput = (name, value) => {
    let errorMsg = '';

    if (!value) {
      errorMsg = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!Object.values(errors).some((error) => error !== '') && Object.values(formData).every((value) => value !== '')) {
      alert('Form Submitted!');
      // Handle form submission logic here
    } else {
      alert('Please fix the errors.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4">Welcome Back!</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'}`}
              placeholder="Enter your username"
            />
            {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'}`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 text-white ${isSubmitting ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'} rounded-lg transition duration-200`}
          >
            {isSubmitting ? 'Submitting...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-teal-500 hover:text-teal-700 transition duration-200">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
