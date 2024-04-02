import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddEmployee() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    nic: '',
    dob: '',
    gender: '',
    address: '',
    image: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/employee', formData);
      console.log('Employee added successfully:', response.data);
      window.alert('Employee added successfully!');
      navigate('/employeelist');
    } catch (error) {
      console.error('Error adding employee:', error);
      window.alert('Error adding employee. Please try again.');
    }
  };

  const handleClear = () => {
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      nic: '',
      dob: '',
      gender: '',
      address: '',
      image: null,
    });
  };

  return (
    <div className="min-h-screen flex justify-content: flex-start items-center">
      <div className="hin-w-screen  w-full p-8 bg-white shadow-md rounded">
        <h2 className="text-2xl font-semibold mb-4 text-left">Employee Registration</h2>
        <form className="min-h-screen" onSubmit={handleSubmit}>
          {/* Form inputs */}
          <label className="block mb-2">First Name:</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className="w-full px-3 py-2 mb-3 border rounded-md"
            required
          />
          <label className="block mb-2">Last Name:</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            className="w-full px-3 py-2 mb-3 border rounded-md"
            required
          />
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 mb-3 border rounded-md"
            required
          />
          <label className="block mb-2">Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 mb-3 border rounded-md"
            required
          />
          <label className="block mb-2">NIC:</label>
          <input
            type="text"
            name="nic"
            value={formData.nic}
            onChange={handleChange}
            className="w-full px-3 py-2 mb-3 border rounded-md"
            required
          />
          <label className="block mb-2">Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full px-3 py-2 mb-3 border rounded-md"
            required
          />
          <label className="block mb-2">Gender:</label>
          <div className="flex justify-left">
            <label className="block mr-2">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === 'Male'}
                onChange={handleChange}
                className="mr-2 border-gray-300 checked:bg-gray-500 checked:border-transparent"
              />
              Male
            </label>
            <label className="block">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === 'Female'}
                onChange={handleChange}
                className="mr-2 border-gray-300 checked:bg-gray-500 checked:border-transparent"
              />
              Female
            </label>
          </div>
          <label className="block mb-2">Address:</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 mb-3 border rounded-md resize-none"
            required
          ></textarea>
          <label className="block mb-2">Image:</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*" // Accept only image files
            className="w-full px-3 py-2 mb-3 border rounded-md resize-none"
            required
          />
          {/* Buttons */}
          <div className="flex justify-left">
            {/* Submit button */}
            <button
              type="submit"
              className="mr-5 w-24 border border-red-500 text-white bg-red-500 py-1 px-2 rounded hover:bg-red-600"
            >
              Submit
            </button>
            {/* Clear button */}
            <button
              type="button"
              onClick={handleClear}
              className="border border-red-500 text-red-500 bg-white-500 py-1 px-2 rounded hover:bg-white-800 w-24"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
