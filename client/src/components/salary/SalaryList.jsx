import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function SalaryList() {
    const [salaries, setSalaries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                const response = await axios.get('/api/salary');
                // Reverse the array to display newly added data at the top
                setSalaries(response.data.reverse());
            } catch (error) {
                console.error('Error fetching salaries:', error);
            }
        };

        fetchSalaries();
    }, []);

    const handleDelete = async (id) => {
        console.log('Delete salary with ID:', id);
        try {
            await axios.delete(`/api/salary/${id}`);
            const updatedSalaries = salaries.filter(salary => salary._id !== id);
            setSalaries(updatedSalaries);
            alert('Salary deleted successfully');
        } catch (error) {
            alert('Error deleting salary:', error);
        }
    };

    const generateSalaryReport = () => {
        try {
            const doc = new jsPDF(); // Initialize jsPDF
            doc.setFontSize(12);
            doc.text('Employee Salary Report', 10, 10);

            // Add table header row
            const headerCols = [
                'Employee ID', 'Month', 'Year', 'Basic Salary', 'OT Hours', 'OT Rate',
                'OT Total', 'Bonus', 'Reduction', 'Net Salary'
            ];
            const headerRowHeight = 5;
            const headerYPos = 15;

            const tableBody = salaries.map(salary => ([
                salary.employeeid, salary.month, salary.year, salary.basicsalary,
                salary.othours, salary.otrate, salary.ottotal, salary.bonus,
                salary.reduction, salary.netsalary
            ]));
            doc.autoTable({
                startY: headerYPos,
                head: [headerCols],
                body: tableBody,
            });

            // Calculate the end Y position of the table manually
            const endY = headerYPos + doc.previousAutoTable.finalY;

            // Add additional report information (optional)
            const additionalInfoYPos = endY + 5;
            doc.text('Report generated on:', 10, additionalInfoYPos);
            doc.text(new Date().toLocaleDateString(), 50, additionalInfoYPos);

            // Save or download the report
            doc.save('salary_report.pdf');
        } catch (error) {
            console.error('Error generating salary report:', error);
        }
    };

    return (
        <div className="flex bg-gray-200">
            <div className="min-h-screen flex">

            </div>
            <div className="ml-8 flex-1 pr-8">
                <div className="newContainer">
                    <div className="top shadow-md py-2 px-4 my-4">
                        <h1 className="text-gray-600 font-bold text-lg">Employee Salary List</h1>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="flex justify-end items-center mb-4">
                            <button
                                type="button"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                onClick={generateSalaryReport}
                            >
                                Generate Salary Report
                            </button>
                            <button
                                type="button"
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => navigate('/dashboard?tab=AddSalary')}
                            >
                                Add New Salary
                            </button>
                        </div>
                        <table className="w-full bg-white">
                            <thead className="bg-gray-300">
                                <tr>
                                    <th className="px-4 py-2 border-b border-gray-300 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Salary ID</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee ID</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Month</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Year</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Basic Salary</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">OT Hours</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">OT Rate</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">OT Total</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Bonus</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Reduction</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Net Salary</th>
                                    <th className="px-4 py-2 border-b border-gray-300 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salaries.map((salary) => (
                                    <tr key={salary._id}>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-gray-900">{salary._id}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-gray-900">{salary.employeeid}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{salary.month}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{salary.year}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{salary.basicsalary}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{salary.othours}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{salary.otrate}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{salary.ottotal}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{salary.bonus}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{salary.reduction}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{salary.netsalary}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">
                                            <div className="flex">
                                            <Link to={`/ViewSalary/${salary._id}`}>
                                                    <FaEye className="mr-2 cursor-pointer text-green-500 hover:text-green-700" />
                                                </Link>
                                                <Link to={`/updatesalary/${salary._id}`}>
                                                    <FaEdit className="mr-2 cursor-pointer text-blue-500 hover:text-blue-700" />
                                                </Link>
                                                <FaTrashAlt className="cursor-pointer text-red-500 hover:text-red-700" onClick={() => handleDelete(salary._id)} />
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
