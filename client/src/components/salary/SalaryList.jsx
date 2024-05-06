import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrashAlt, FaSearch, FaDownload } from 'react-icons/fa'; // Import FaFilePdf for the new button
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function SalaryList() {
    const [salaries, setSalaries] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // State for the search query
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                const response = await axios.get('/api/salary');
                setSalaries(response.data.reverse()); // Display recent data at the top
            } catch (error) {
                console.error('Error fetching salaries:', error);
            }
        };

        fetchSalaries(); // Fetch salaries on component mount
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/salary/${id}`);
            setSalaries(salaries.filter((salary) => salary._id !== id));
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


    const generateIndividualSalaryReport = (employeeId) => {
        try {
            const employeeSalary = salaries.find(
                (salary) => salary.employeeid === employeeId
            );

            if (employeeSalary) {
                const doc = new jsPDF();
                doc.setFontSize(12);
                doc.text('Employee Salary Report', 10, 10);

                const data = [
                    {
                        key: 'Employee ID',
                        value: employeeSalary.employeeid,
                    },
                    {
                        key: 'Month',
                        value: employeeSalary.month,
                    },
                    {
                        key: 'Year',
                        value: employeeSalary.year,
                    },
                    {
                        key: 'Basic Salary',
                        value: employeeSalary.basicsalary,
                    },
                    {
                        key: 'OT Hours',
                        value: employeeSalary.othours,
                    },
                    {
                        key: 'OT Rate',
                        value: employeeSalary.otrate,
                    },
                    {
                        key: 'OT Total',
                        value: employeeSalary.ottotal,
                    },
                    {
                        key: 'Bonus',
                        value: employeeSalary.bonus,
                    },
                    {
                        key: 'Reduction',
                        value: employeeSalary.reduction,
                    },
                    {
                        key: 'Net Salary',
                        value: employeeSalary.netsalary,
                    },
                ];

                doc.autoTable({
                    startY: 15,
                    head: [['Key', 'Value']],
                    body: data.map((item) => [item.key, item.value]),
                });

                doc.save(`salary_report_${employeeId}.pdf`);
            } else {
                console.error('Employee salary not found');
            }
        } catch (error) {
            console.error('Error generating salary report:', error);
        }
    };

    const filteredSalaries = salaries.filter(
        (salary) =>
            salary.employeeid.toLowerCase().includes(searchQuery.toLowerCase())
    ); // Case-insensitive search

    return (
        <div className="flex bg-gray-200">
            <div className="ml-8 flex-1 pr-8">
                <div className="newContainer">
                    <div className="top shadow-md py-2 px-4 my-4 flex justify-between items-center">
                        <h1 className="text-gray-600 font-bold text-lg">Employee Salary List</h1>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="relative w-64">
                            <input
                                type="text"
                                placeholder="Search by Employee ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input
                                className="border p-2 rounded-full w-full pr-8 pl-4 text-gray-700"
                            />
                            <FaSearch
                                className="absolute right-3 top-2 text-gray-500 cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center">
                            <button
                                type="button"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
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
                    </div>

                    <div className="overflow-x-auto">
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
                                {filteredSalaries.map((salary) => (
                                    <tr key={salary._id}>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-gray-900">{salary._id}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-gray-900">{salary.employeeid}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{salary.month}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{salary.year}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{salary.basicsalary}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{salary.othours}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{salary.otrate}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-center text-sm text-gray-900">{salary.ottotal}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{salary.bonus}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{salary.reduction}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">{salary.netsalary}</td>
                                        <td className="px-4 py-2 border-b border-gray-300 text-sm text-center text-gray-900">
                                            <div className="flex">
                                                <Link to={`/ViewSalary/${salary._id}`}>
                                                    <FaEye
                                                        className="mr-2 cursor-pointer text-green-500 hover-text-green-700"
                                                    />
                                                </Link>
                                                <Link to={`/updatesalary/${salary._id}`}>
                                                    <FaEdit
                                                        className="mr-2 cursor-pointer text-blue-500 hover-text-blue-700"
                                                        onClick={() => handleUpdate(salary._id)}
                                                    />
                                                </Link>
                                                <FaDownload
                                                    className="cursor-pointer text-grey-500 hover-text-red-700"
                                                    onClick={() => generateIndividualSalaryReport(salary.employeeid)}
                                                />
                                                <FaTrashAlt
                                                    className="cursor-pointer text-red-500 hover-text-red-700"
                                                    onClick={() => handleDelete(salary._id)}
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
