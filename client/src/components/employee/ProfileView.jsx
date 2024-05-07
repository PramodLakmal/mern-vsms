import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye,FaSearch } from 'react-icons/fa'; // Import the new icon
import { Link, useNavigate } from 'react-router-dom';

export default function ProfileView() {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/api/employee');
        setEmployees(response.data.reverse()); // Reverse to show recent data at the top
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.lastname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex ">
      <div className="min-h-screen flex"></div>
      <div className="ml-8 flex-1 pr-8">
        <div className="newContainer">
          <div className="top shadow-md py-2 px-4 my-4">
            <h1 className="text-gray-600 font-bold text-lg">Employee Summary</h1>
          </div>

          <div className="overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64 mt-3 ml-1">
                <input
                  type="text"
                  placeholder="Search by Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border p-2 rounded-full w-full pr-10 pl-4 text-gray-700"
                />
                <FaSearch
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                />
              </div>
              
            </div>

            <table className="w-full sm:w-auto max-w-[90%] bg-white text-xs">
              <thead className="bg-gray-300">
                <tr>
                  <th className="px-1 py-1 sm:px-2 sm:py-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-1 py-1 sm:px-2 sm:py-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">First</th>
                  <th className="px-1 py-1 sm:px-2 sm:py-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">Last</th>
                  <th className="px-1 py-1 sm:px-2 sm:py-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-1 py-1 sm:px-2 sm:py-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                  <th className="px-1 py-1 sm:px-2 sm:py-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">NIC</th>
                  <th className="px-1 py-1 sm:px-2 sm:py-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">DOB</th>
                  <th className="px-1 py-2 sm:px-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">Gender</th>
                  <th className="px-1 py-2 sm:px-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">Address</th>
                  <th className="px-1 py-1 sm:px-2 sm:py-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                  <th className="px-1 py-1 sm:px-2 sm:py-2 border-b border-gray-300 text-center font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee._id}>
                    <td className="px-4 py-2 border-b border-gray-300 text-sm text-gray-900">{employee._id}</td>
                    <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{employee.firstname}</td>
                    <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{employee.lastname}</td>
                    <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{employee.email}</td>
                    <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{employee.phone}</td>
                    <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{employee.nic}</td>
                    <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{new Date(employee.dob).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{employee.gender}</td>
                    <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{employee.address}</td>
                    <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">
                      <img src={employee.imageUrl} alt="Employee" className="h-10 w-10 rounded-full" />
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">
                      <div className="flex justify-center">
                        <Link to={`/ViewEmployee/${employee._id}`}>
                          <FaEye className="mr-2 cursor-pointer text-green-500 hover-text-green-700" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
