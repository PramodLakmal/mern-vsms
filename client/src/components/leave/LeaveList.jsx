import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';

export default function LeaveList() {
    const [leaves, setLeaves] = useState([]);
    const navigate = useNavigate(); // Add useNavigate hook

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const response = await axios.get('/api/leave');
                // Reverse the array to display newly added data at the top
                setLeaves(response.data.reverse());
            } catch (error) {
                console.error('Error fetching leaves:', error);
            }
        };

        fetchLeaves();
    }, []);

    const handleUpdate = (id) => {
        // Implement your update logic here
        console.log('Update leave with ID:', id);
        navigate(`/updateleave/${id}`); // Navigate to UpdateLeave page with leave ID
    };

    const handleDelete = async (id) => {
        // Implement your delete logic here
        console.log('Delete leave with ID:', id);
        try {
            await axios.delete(`/api/leave/${id}`);
            const updatedleaves = leaves.filter(leave => leave._id !== id);
            setLeaves(updatedleaves);
            alert('Leave deleted successfully');
        } catch (error) {
            alert('Error deleting leave:', error);
        }
    };

    return (
        <div className="flex bg-gray-200">
            <div className="min-h-screen flex">
            </div>
            {/* Table content */}
            <div className="ml-8 flex-1 pr-8">
                <div className="newContainer">
                    <div className="top shadow-md py-2 px-4 my-4">
                        <h1 className="text-gray-600 font-bold text-lg">Employee Leave Evaluation</h1>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="flex justify-end items-center mb-4">

                            <button
                                type="button"
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => navigate('/dashboard?tab=AddLeave')}
                            >
                                Add New Leave
                            </button>
                        </div>
                        <table className="w-full bg-white">
                            <thead className="bg-gray-300">
                                <tr>
                                    <th className="px-4 py-2 border-b border-gray-300 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Leave ID</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee ID</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Leave Type</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Date From</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Date To</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">No.of Days</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reason</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.map((leave) => (
                                    <tr key={leave._id}>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-gray-900">{leave._id}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-gray-900">{leave.employeeid}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-gray-900">{leave.leavetype}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{new Date(leave.startdate).toLocaleDateString()}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{new Date(leave.enddate).toLocaleDateString()}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{leave.numofdays}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-gray-900">{leave.reason}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-gray-900">{leave.status}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">
                                            <div className="flex">
                                                <Link to={`/ViewLeave/${leave._id}`}>
                                                    <FaEye className="mr-2 cursor-pointer text-green-500 hover:text-green-700" />
                                                </Link>
                                                <Link to={`/updateleave/${leave._id}`}>
                                                    <FaEdit className="mr-2 cursor-pointer text-blue-500 hover:text-blue-700" />
                                                </Link>
                                                <FaTrashAlt className="cursor-pointer text-red-500 hover:text-red-700" onClick={() => handleDelete(leave._id)} />
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
