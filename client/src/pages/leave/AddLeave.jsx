import React, { useState } from 'react';

export default function AddLeave() {
  const [formData, setFormData] = useState({
    employeeid: '',
    leavetype: '',
    startdate: '',
    enddate: '',
    numofdays: '',
    reason: '',
    status: 'pending',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle form submission logic here, such as sending data to the server
    console.log(formData);
  };

  return (
    <div className='min-h-screen flex justify-content: flex-start items-center'>
      <div className='hin-w-screen  w-full p-8 bg-white shadow-md rounded'>

      <h2 className=" text-2xl font-semibold mb-4 text-left">Leave Application</h2>
        <form className="min-h-screen" onSubmit={handleSubmit}>

          <label className="block mb-2">Employee ID:</label>
            <input
              type="text"
              name="employeeid"
              value={formData.employeeid}
              onChange={handleChange}
              className="w-full px-3 py-2 mb-3 border rounded-md"
              required
            />
          
          <label className="block mb-2">Leave Type:</label>
            <select
              name="leavetype"
              value={formData.leavetype}
              onChange={handleChange}
              className="w-full px-3 py-2 mb-3 border rounded-md"
              required
            >
              <option value="">Select Leave Type</option>
              <option value="Casual">Casual</option>
              <option value="Annual">Annual</option>
              <option value="Sick">Sick</option>
            </select>
            
          <label className="block mb-2">Start Date:</label>
            <input
              type="date"
              name="startdate"
              value={formData.startdate}
              onChange={handleChange}
              className="w-full px-3 py-2 mb-3 border rounded-md"
              required
            />

          <label className="block mb-2">End Date:</label>
            <input
              type="date"
              name="enddate"
              value={formData.enddate}
              onChange={handleChange}
              className="w-full px-3 py-2 mb-3 border rounded-md"
              required  
            />

          <label className="block mb-2">Number of Days:</label>
            <input
              type="number"
              name="numofdays"
              value={formData.numofdays}
              onChange={handleChange}
              className="w-full px-3 py-2 mb-3 border rounded-md"
              required
            />

          <label className="block mb-2">Reason:</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full px-3 py-2 mb-3 border rounded-md resize-none"
              required
            ></textarea> 

          <div className="flex justify-left">
            <button
              type='submit'
              className='mr-5 w-24 border border-red-500 text-white bg-red-500 py-1 px-2 rounded hover:bg-red-600'
            >
              Submit
            </button>

            <button
              type='submit'
              className='border border-red-500 text-red-500 bg-white-500 py-1 px-2 rounded hover:bg-white-800'
              style={{ width: '6rem' }} // Adjusted width to match the width of the "Submit" button
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
