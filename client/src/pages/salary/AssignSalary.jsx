import React, { useState } from 'react';

export default function AssignSalary() {
  const [formData, setFormData] = useState({
    employeeid: '',
    month: '',
    year: '',
    basicsalary: '',
    othours: '',
    otrate: '',
    ottotal: '',
    bonus: '',
    reduction: '',
    netsalary: '',
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

      <h2 className=" text-2xl font-semibold mb-4 text-left">Assign Salary</h2>
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
          
            <label className="block mb-2">Month:</label>
                <input
                    type="month"
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    className="w-full px-3 py-2 mb-3 border rounded-md"
                    required
                />

            <label className="block mb-2">Basic Salary:</label>
                <input
                    type="number"
                    name="basicsalary"
                    value={formData.basicsalary}
                    onChange={handleChange}
                    className="w-full px-3 py-2 mb-3 border rounded-md"
                    min={0} // Set the minimum value to zero
                    required
                />

            <label className="block mb-2">OT Hours:</label>
                <input
                    type="number"
                    name="othours"
                    value={formData.othours}
                    onChange={handleChange}
                    className="w-full px-3 py-2 mb-3 border rounded-md"
                    min={0} // Set the minimum value to zero
                    required
                />

            <label className="block mb-2">OT Rate:</label>
                <input
                    type="number"
                    name="otrate"
                    value={formData.otrate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 mb-3 border rounded-md"
                    min={0} // Set the minimum value to zero
                    required
                />

            <label className="block mb-2">OT Total:</label>
                <input
                    type="number"
                    name="ottotal"
                    value={formData.ottotal}
                    onChange={handleChange}
                    className="w-full px-3 py-2 mb-3 border rounded-md"
                    min={0} // Set the minimum value to zero
                    required
                />

            <label className="block mb-2">Bonus:</label>
                <input
                    type="number"
                    name="bonus"
                    value={formData.bonus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 mb-3 border rounded-md"
                    min={0} // Set the minimum value to zero
                    required
                />

            <label className="block mb-2">Reduction:</label>
                <input
                    type="number"
                    name="reduction"
                    value={formData.reduction}
                    onChange={handleChange}
                    className="w-full px-3 py-2 mb-3 border rounded-md"
                    min={0} // Set the minimum value to zero
                    required
                />

            <label className="block mb-2">Net Salary:</label>
                <input
                    type="number"
                    name="netsalary"
                    value={formData.netsalary}
                    onChange={handleChange}
                    className="w-full px-3 py-2 mb-3 border rounded-md"
                    min={0} // Set the minimum value to zero
                    required
                />

            <div className="flex justify-left">
                <button
                    type='submit'
                    className='mr-5 w-24 border border-red-500 text-white bg-red-500 py-1 px-2 rounded hover:bg-red-600'
                >
                    Save
                </button>

                <button
                    type='submit'
                    className='border border-red-500 text-red-500 bg-white-500 py-1 px-2 rounded hover:bg-white-800'
                    style={{ width: '5.75rem' }} // Adjusted width to match the width of the "Save" button
                >
                    Cancel
                </button>
            </div>

        </form>
      </div>
    </div>
  );
}
