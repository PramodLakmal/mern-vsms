import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DashSidebar from '../../components/DashSidebar';
import viewSalaryImage from '../../public/updatesalary.png';

export default function ViewSalary() {
    const { id } = useParams();
    const [salaryData, setSalaryData] = useState({});

    useEffect(() => {
        const fetchSalary = async () => {
            try {
                const response = await axios.get(`/api/salary/${id}`);
                setSalaryData(response.data);
            } catch (error) {
                console.error('Error fetching salary:', error);
            }
        };

        fetchSalary();
    }, [id]);
    return (
        <div className="flex justify-center  w-full">
            <div className="min-h-screen flex">
                <DashSidebar />
            </div>
            <div className="ml-8 flex-1 pr-8">
                <div className="newContainer ml-0">
                    <div className="top shadow-md py-2 px-4 my-4 flex ">
                        <h1 className="text-gray-600 font-bold text-lg flex-grow">View Salary Details</h1>
                    </div>
                    <div className="bottom shadow-md p-4 flex justify-between">
                        <div className="w-1/2">
                            <div className="flex flex-wrap gap-8 justify-between mb-4">

                                <div className="w-full flex">
                                </div>
                                <div className="w-1/3 pr-1"> {/* Adjusted width */}
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="employeeid">
                                        Employee ID
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="employeeid"
                                        type="text"
                                        value={salaryData.employeeid || ''}
                                        readOnly // Make it read-only
                                    />
                                </div>
                                <div className="w-1/5 px-1"> {/* Adjusted width and added padding */}
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="month">
                                        Month
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="month"
                                        type="text"
                                        value={salaryData.month || ''}
                                        readOnly
                                    />
                                </div>
                                <div className="w-1/5 pl-1"> {/* Adjusted width */}
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">
                                        Year
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="year"
                                        type="text"
                                        value={salaryData.year || ''}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="basicsalary">
                                    Basic Salary:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-3"
                                    id="basicsalary"
                                    type="text"

                                    value={salaryData.basicsalary || ''}

                                    required
                                />
                            </div>
                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="othours">
                                    OT Hours:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-7"
                                    id="othours"
                                    type="text"

                                    value={salaryData.othours || ''}
                                    readOnly
                                />
                            </div>
                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otrate">
                                    OT Rate:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-1/3  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-9"
                                    id="otrate"
                                    type="text"
                                    name="otrate"
                                    value={salaryData.otrate || ''}
                                    readOnly
                                />
                            </div>
                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ottotal">
                                    OT Total:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-1/3  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-8"
                                    id="ottotal"
                                    type="text"
                                    value={salaryData.ottotal || ''}
                                    readOnly
                                />
                            </div>
                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bonus">
                                    Bonus:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-1/3  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-11"
                                    id="bonus"
                                    type="text"
                                    value={salaryData.bonus || ''}
                                    readOnly
                                />
                            </div>
                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reduction">
                                    Reduction:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-5"
                                    id="reduction"
                                    type="text"
                                    value={salaryData.reduction || ''}
                                    readOnly

                                />
                            </div>
                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="netsalary">
                                    Net Salary:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-5"
                                    id="netsalary"
                                    type="text"
                                    value={salaryData.netsalary || ''}
                                    readOnly

                                />
                            </div>


                        </div>
                        <div className="ml-3 mr-3">
                            <img src={viewSalaryImage} alt="View Salary" className="h-90 w-90" /> {/* Adjust the height and width of the image */}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
