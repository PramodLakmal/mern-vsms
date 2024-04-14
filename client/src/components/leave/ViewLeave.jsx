import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DashSidebar from '../../components/DashSidebar'; // Import DashSidebar component
import updateLeaveImage from '../../public/updateleave.png';

function ViewLeave() {
    const { id } = useParams();
    const [leaveData, setLeaveData] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchLeave = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/leave/${id}`);
                response.data.startdate = response.data.startdate.split('T')[0];
                response.data.enddate = response.data.enddate.split('T')[0];
                setLeaveData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching leave details:', error);
                setErrorMessage("Failed to fetch leave details. Please try again.");
                setLoading(false);
            }
        };

        fetchLeave();
    }, [id]);

    return (
        <div className="flex bg-gray-200">
            <div className="min-h-screen flex">
                <DashSidebar />
            </div>
            <div className="ml-8 flex-1 pr-8">
                <div className="newContainer ml-0">
                    <div className="top shadow-md py-2 px-4 my-4 flex ">
                        <h1 className="text-gray-600 font-bold text-lg flex-grow">View Applied Leave</h1>
                    </div>
                    <div className="bottom shadow-md p-4 flex">
                        <div className="ml-3">
                            <div className="justify-left">
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="employeeid">
                                        Employee ID
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="employeeid"
                                        type="text"
                                        name="employeeid"
                                        value={leaveData.employeeid || ''}
                                        readOnly // Make it read-only
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="leavetype">
                                        Leave Type
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="leavetype"
                                        type="text"
                                        name="leavetype"
                                        value={leaveData.leavetype || ''}
                                        readOnly // Make it read-only
                                    />
                                </div>
                                <div className="mb-4 flex flex-wrap -mx-2">
                                    <div className="w-full md:w-1/3 px-2">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startdate">
                                            Start Date
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="startdate"
                                            type="text" // Change type to text
                                            name="startdate"
                                            value={leaveData.startdate || ''}
                                            readOnly // Make it read-only
                                        />
                                    </div>
                                    <div className="w-full md:w-1/3 px-2">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="enddate">
                                            End Date
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="enddate"
                                            type="text" // Change type to text
                                            name="enddate"
                                            value={leaveData.enddate || ''}
                                            readOnly // Make it read-only

                                        />
                                    </div>
                                    <div className="w-full md:w-1/3 px-2">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numofdays">
                                            Number of Days
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="numofdays"
                                            type="text" // Change type to text
                                            name="numofdays"
                                            value={leaveData.numofdays || ''}
                                            readOnly // Make it read-only
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
                                        Reason
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="reason"
                                        type="text"
                                        name="reason"
                                        value={leaveData.reason || ''}
                                        readOnly // Make it read-only
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Status
                                    </label>
                                    <div className="flex">
                                        <label className="mr-4">
                                            <input
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="status"
                                                type="text"
                                                value={leaveData.status || ''}
                                                readOnly
                                            />
                                        </label>
                                    </div>
                                </div>



                            </div>
                        </div>
                        {/* Image: Update Leave */}
                        <div className="flex items-center h-half">
                            <div className="ml-3">
                                <img src={updateLeaveImage} alt="View Leave" className="h-49 w-49" /> {/* Adjust the height and width of the image */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewLeave;
