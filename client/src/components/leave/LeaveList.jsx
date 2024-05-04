import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrashAlt, FaSearch } from 'react-icons/fa'; // Import FaSearch for search icon

export default function LeaveList() {
    const [leaves, setLeaves] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState(''); // Filter by status
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const response = await axios.get('/api/leave');
                setLeaves(response.data.reverse()); // Reverse to show recent data at the top
            } catch (error) {
                console.error('Error fetching leaves:', error);
            }
        };

        fetchLeaves(); // Fetch leaves when component mounts
    }, []);

    const handleUpdate = (id) => {
        navigate(`/updateleave/${id}`); // Navigate to update page with leave ID
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/leave/${id}`);
            setLeaves(leaves.filter((leave) => leave._id !== id));
            alert('Leave deleted successfully');
        } catch (error) {
            alert('Error deleting leave:', error);
        }
    };

    // Filter leaves based on the search query and the selected filter status
    const filteredLeaves = leaves
        .filter((leave) =>
            leave.employeeid.toLowerCase().includes(searchQuery.toLowerCase()) // Case-insensitive search by employee ID
        )
        .filter((leave) => {
            if (filterStatus) {
                return leave.status.toLowerCase() === filterStatus.toLowerCase(); // Filter by status
            }
            return true; // No filter applied
        });

    return (
        <div className="flex bg-gray-200">
            <div className="ml-8 flex-1 pr-8">
                <div className="newContainer">
                    <div className="top shadow-md py-2 px-4 my-4 flex justify-between items-center">
                        <h1 className="text-gray-600 font-bold text-lg">Employee Leave Evaluation</h1>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                            <div className="relative w-64">
                                <input
                                    type="text"
                                    placeholder="Search by Employee ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="border p-2 rounded-full w-full pr-8 pl-4 text-gray-700"
                                />
                                <FaSearch
                                    className="absolute right-3 top-2 text-gray-500 cursor-pointer"
                                />
                            </div>
                        </div>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="border p-2 rounded-full text-gray-700 w-1/4" // Adjusted width to increase length
                        >
                            <option value="" disabled>Select the Filter Category</option>
                            <option value="">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>


                        <button
                            type="button"
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={() => navigate('/dashboard?tab=AddLeave')}
                        >
                            Add New Leave
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full bg-white">
                            <thead className="bg-gray-300">
                                <tr>
                                    <th className="px-4 py-2 border-b border-gray-300 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Leave ID</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee ID</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider">Leave Type</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date From</th>
                                    <th class="px-4 py-2 border-b border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date To</th>
                                    <th class="px-4 py-2 border-b border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider">No. of Days</th>
                                    <th class="px-4 py-2 border-b border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider">Reason</th>
                                    <th class="px-4 py-2 border-b border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th class="px-4 py-2 border-b border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeaves.map((leave) => (
                                    <tr key={leave._id}>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-gray-900">{leave._id}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-gray-900">{leave.employeeid}</td>
                                        <td class="px-4 py-2 border-b border-gray-300 text-sm text-gray-900">{leave.leavetype}</td>
                                        <td class="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{new Date(leave.startdate).toLocaleDateString()}</td>
                                        <td class="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{new Date(leave.enddate).toLocaleDateString()}</td>
                                        <td class="px-4 py-2 border-b border-gray-300 text-sm text-gray-900">{leave.numofdays}</td>
                                        <td class="px-4 py-2 border-b border-gray-300 text-sm text-gray-900">{leave.reason}</td>
                                        <td class="px-4 py-2 border-b border-gray-300 text-sm text-gray-900">{leave.status}</td>
                                        <td class="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">
                                            <div className="flex">
                                                <Link to={`/ViewLeave/${leave._id}`}>
                                                    <FaEye
                                                        className="mr-2 cursor-pointer text-green-500 hover=text-green-700"
                                                    />
                                                </Link>
                                                <FaEdit
                                                    class="mr-2 cursor-pointer text-blue-500 hover=text-blue-700"
                                                    onClick={() => handleUpdate(leave._id)}
                                                />
                                                <FaTrashAlt
                                                    class="cursor-pointer text-red-500 hover=text-red-700"
                                                    onClick={() => handleDelete(leave._id)}
                                                />
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
