import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import applyLeaveImage from '../../public/applyleave.png';


export default function AddLeave() {
    const navigate = useNavigate();
    const [leaveData, setLeaveData] = useState({
        employeeid: '',
        leavetype: '',
        startdate: '',
        enddate: '',
        numofdays: '',
        reason: '',
        status: 'Pending'
    });
    const [errorMessages, setErrorMessages] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (e) => {
        const query = e.target.value;
        if (query.length > 2) {
            try {
                const response = await axios.get(`/api/employee/search/${query}`);
                setSearchResults(response.data);
            } catch (error) {
                console.error('Error searching employees:', error);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectEmployee = (employee) => {
        setLeaveData({ ...leaveData, employeeid: employee._id });
        setSearchResults([]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedLeaveData = { ...leaveData, [name]: value };

        if (name === 'startdate' || name === 'enddate') {
            const startDate = new Date(updatedLeaveData.startdate);
            const endDate = new Date(updatedLeaveData.enddate);

            if (startDate && endDate) {
                const diffInDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                updatedLeaveData.numofdays = diffInDays >= 1 ? diffInDays : '';
            } else {
                updatedLeaveData.numofdays = '';
            }
        }

        setLeaveData(updatedLeaveData);
        setErrorMessages([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessages([]);
        try {
            const response = await axios.post('/api/leave', leaveData);
            console.log('Leave added successfully:', response.data);
            window.alert('Leave added successfully!');
            navigate('/dashboard?tab=LeaveList');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errors = error.response.data.error;
                setErrorMessages([errors]); // Capture validation error message
            } else {
                console.error('Error adding leave:', error);
                setErrorMessages(['An unexpected error occurred. Please try again.']);
            }
        }
    };

    const handleClear = () => {
        setLeaveData({
            employeeid: '',
            leavetype: '',
            startdate: '',
            enddate: '',
            numofdays: '',
            reason: '',
            status: 'Pending'
        });
        setErrorMessages([]);
    };

    return (
        <div className="flex ">
            <div className="min-h-screen flex">

            </div>
            <div className="ml-8 flex-1 pr-8">
                <div className="newContainer ml-0">
                    <div className="top shadow-md py-2 px-4 my-4 flex ">
                        <h1 className="text-gray-600 font-bold text-lg flex-grow">Apply Leaves</h1>
                    </div>
                    <div className="bottom shadow-md p-4 flex">
                        <div className="ml-3">
                            <form onSubmit={handleSubmit} className="justify-left">
                                {/* Search field for Employee ID */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="employeeSearch">
                                        Search Employee
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="employeeSearch"
                                        type="text"
                                        name="employeeSearch"
                                        placeholder="Search by first or last name"
                                        onChange={handleSearch}
                                    />
                                    {/* Display search results */}
                                    {searchResults.length > 0 && (
                                        <div className="border rounded bg-white shadow mt-2">
                                            {searchResults.map((employee) => (
                                                <div
                                                    key={employee._id}
                                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                                    onClick={() => handleSelectEmployee(employee)}
                                                >
                                                    {employee.firstname} {employee.lastname}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Display Employee ID */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="employeeid">
                                        Employee ID
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="employeeid"
                                        type="text"
                                        name="employeeid"
                                        value={leaveData.employeeid}
                                        read-only
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="leavetype">
                                        Leave Type
                                    </label>
                                    <select
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="leavetype"
                                        name="leavetype"
                                        value={leaveData.leavetype}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>Select Leave Type</option>
                                        <option value="Casual">Casual</option>
                                        <option value="Annual">Annual</option>
                                        <option value="Sick">Sick</option>
                                    </select>
                                </div>
                                <div className="mb-4 flex flex-wrap -mx-2">
                                    <div className="w-full md:w-1/3 px-2">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startdate">
                                            Start Date
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="startdate"
                                            type="date"
                                            name="startdate"
                                            value={leaveData.startdate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="w-full md:w-1/3 px-2">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="enddate">
                                            End Date
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="enddate"
                                            type="date"
                                            name="enddate"
                                            value={leaveData.enddate}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="w-full md:w-1/3 px-2">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numofdays">
                                            Number of Days
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="numofdays"
                                            type="number"
                                            name="numofdays"
                                            value={leaveData.numofdays}
                                            read-only
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
                                        Reason
                                    </label>
                                    <textarea
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="reason"
                                        name="reason"
                                        value={leaveData.reason}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Status
                                    </label>
                                    <div className="flex">
                                        <label className="mr-4">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="Pending"
                                                checked={leaveData.status === 'Pending'}
                                                onChange={handleChange}
                                            />
                                            <span className="ml-2 text-gray-700">Pending</span>
                                        </label>
                                        <label className="mr-4">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="Approved"
                                                checked={leaveData.status === 'Approved'}
                                                onChange={handleChange}
                                                disabled
                                            />
                                            <span className="ml-2 text-gray-700">Approved</span>
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="status"
                                                value="Rejected"
                                                checked={leaveData.status === 'Rejected'}
                                                onChange={handleChange}
                                                disabled
                                            />
                                            <span className="ml-2 text-gray-700">Rejected</span>
                                        </label>
                                    </div>
                                </div>
                                {/* Display validation error messages */}
                                {errorMessages.length > 0 && (
                                    <div className="text-red-500 mb-4">
                                        {errorMessages.map((msg, index) => (
                                            <p key={index}>{msg}</p>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center space-x-6">
                                    <button
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-24"
                                        type="submit"
                                    >
                                        Submit
                                    </button>
                                    <button
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-24"
                                        type="button"
                                        onClick={handleClear}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </form>
                        </div>
                        {/* Image: Update Leave */}
                        <div className="flex items-center h-half">
                            <div className="ml-3">
                                <img src={applyLeaveImage} alt="Update Leave" className="h-49 w-49" /> {/* Adjust the height and width of the image */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
