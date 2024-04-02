import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/employee');
        setEmployees(response.data);
        setErrorMessage('');
      } catch (error) {
        setErrorMessage('Error fetching data. Please try again.');
        console.error('Error fetching data:', error);
      }
    };

    const handleDelete = async (employeeId) => {
      try {
        await axios.delete(`/api/employee/${employeeId}`);
        showMessage('Employee deleted successfully!', true);
        fetchData(); // Fetch data again after deletion
      } catch (error) {
        showMessage('Error deleting employee. Please try again.', false);
        console.error('Error deleting employee:', error);
      }
    };
  
    const showMessage = (message, isSuccess) => {
      if (isSuccess) {
        window.alert('Success: ' + message);
      } else {
        window.alert('Error: ' + message);
      }
    };

  return (
    <div className="min-h-screen flex">
      <div className="w-full p-8 bg-white shadow-md rounded">
        <h2 className="text-2xl font-semibold mb-4 text-left">Employee Summary</h2>
        {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
        <Link to="/addemployee" className="mr-5 w-30 border border-red-500 text-white bg-red-500 py-1 px-2 rounded hover:bg-red-600">Add New Employee</Link>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Employee ID</th>
              <th className="px-4 py-2">First Name</th>
              <th className="px-4 py-2">Last Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">NIC</th>
              <th className="px-4 py-2">Date of Birth</th>
              <th className="px-4 py-2">Gender</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{1000 + index}</td>
                <td className="border px-4 py-2">{employee.firstname}</td>
                <td className="border px-4 py-2">{employee.lastname}</td>
                <td className="border px-4 py-2">{employee.email}</td>
                <td className="border px-4 py-2">{employee.phone}</td>
                <td className="border px-4 py-2">{employee.nic}</td>
                <td className="border px-4 py-2">{employee.dob.split('T')[0]}</td>
                <td className="border px-4 py-2">{employee.gender}</td>
                <td className="border px-4 py-2">{employee.address}</td>
                <td className="border px-4 py-2">
                  <img src={employee.image} alt="Employee" className="w-16 h-16" />
                </td>
                <td className="border px-4 py-2">
                    <Link to={`/view/${employee._id}`} className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                        <i className="fas fa-eye mr-1"></i> 
                    </Link>
                    <Link to={`/update/${employee._id}`} className="ml-2 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                        <i className="fas fa-edit mr-1"></i> 
                    </Link>
                    <Link to={`/view/${employee._id}`} className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                        <i className="fas fa-trash-alt mr-1"></i> 
                    </Link>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
