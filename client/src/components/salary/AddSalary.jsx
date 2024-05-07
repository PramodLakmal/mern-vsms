import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import salaryImage from '../../public/salary.png';

export default function AddSalary() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search); // Extract query parameters
    const employeeId = searchParams.get('employeeId'); // Get the Employee ID
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [salaryData, setSalaryData] = useState({
        employeeid: searchParams.get('employeeId') || '',
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

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

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
        setSalaryData((prevState) => ({
            ...prevState,
            employeeid: employee._id,
        }));
        setSearchResults([]); // Clear the search results
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'othours' || name === 'otrate') {
            // Calculate ottotal
            const otHours = name === 'othours' ? parseInt(value) : parseInt(salaryData.othours || 0);
            const otRate = name === 'otrate' ? parseInt(value) : parseInt(salaryData.otrate || 0);
            const otTotal = isNaN(otHours) || isNaN(otRate) ? '' : otHours * otRate;

            setSalaryData(prevState => ({
                ...prevState,
                ottotal: isNaN(otTotal) ? '' : otTotal.toString(),
                [name]: value
            }));
        } else if (name === 'basicsalary') {
            // Handle basicsalary separately
            const basicSalary = parseInt(value || 0);
            const bonus = parseInt(salaryData.bonus || 0);
            const reduction = parseInt(salaryData.reduction || 0);
            const otTotal = parseInt(salaryData.ottotal || 0);

            const netSalary = basicSalary + otTotal + bonus - reduction;

            setSalaryData(prevState => ({
                ...prevState,
                [name]: value,
                netsalary: isNaN(netSalary) ? '' : netSalary.toString()
            }));
        } else if (name === 'bonus' || name === 'reduction') {
            // Calculate netsalary
            const basicSalary = parseInt(salaryData.basicsalary || 0);
            const bonus = parseInt(name === 'bonus' ? value : salaryData.bonus || 0);
            const reduction = parseInt(name === 'reduction' ? value : salaryData.reduction || 0);
            const otTotal = parseInt(salaryData.ottotal || 0);

            const netSalary = basicSalary + otTotal + bonus - reduction;

            setSalaryData(prevState => ({
                ...prevState,
                [name]: value,
                netsalary: isNaN(netSalary) ? '' : netSalary.toString()
            }));
        } else {
            setSalaryData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/salary', salaryData);
            console.log('Salary added successfully:', response.data);
            window.alert('Salary added successfully!');
            navigate('/dashboard?tab=SalaryList');
        } catch (error) {
            console.error('Error adding salary:', error);
            window.alert('Error adding salary. Please try again.');
        }
    };

    const handleClear = () => {
        setSalaryData({
            employeeid: employeeId || '', // Reset to initial state with Employee ID
            month: '',
            year: '',
            basicsalary: '',
            othours: '',
            otrate: '',
            ottotal: '',
            bonus: '',
            reduction: '',
            netsalary: ''
        });
    };

    return (
        <div className="flex justify-center  w-full">
            <div className="min-h-screen flex"></div>
            <div className="ml-8 flex-1 pr-8">
                <div className="newContainer ml-0">
                    <div className="top shadow-md py-2 px-4 my-4 flex ">
                        <h1 className="text-gray-600 font-bold text-lg flex-grow">Employee Salary Assignment</h1>
                    </div>
                    <div className="bottom shadow-md p-4 flex justify-between">
                        <form onSubmit={handleSubmit} className="w-1/2">
                            {/* Search field for Employee ID */}
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="employeeSearch">
                                    Search Employee
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                    id="employeeSearch"
                                    type="text"
                                    placeholder="Search by first or last name"
                                    onChange={handleSearch}
                                    value={searchQuery}
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
                            <div className="flex flex-wrap gap-8 justify-between mb-4">
                                <div className="w-full flex">
                                    <div className="w-1/2 pr-2">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="employeeid">
                                            Employee ID
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                            id="employeeid"
                                            type="text"
                                            read-only
                                            value={salaryData.employeeid}
                                        />
                                    </div>
                                    <div className="w-1/8 pl-2">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="month">
                                            Month
                                        </label>
                                        <select
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="month"
                                            name="month"
                                            value={salaryData.month}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="" disabled>Select Month</option>
                                            <option value="January">January</option>
                                            <option value="February">February</option>
                                            <option value="March">March</option>
                                            <option value="April">April</option>
                                            <option value="May">May</option>
                                            <option value="June">June</option>
                                            <option value="July">July</option>
                                            <option value="August">August</option>
                                            <option value="September">September</option>
                                            <option value="October">October</option>
                                            <option value="November">November</option>
                                            <option value="December">December</option>
                                        </select>
                                    </div>

                                    <div className="w-1/8 pl-2">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">
                                            Year
                                        </label>
                                        <select
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="year"
                                            name="year"
                                            value={salaryData.year}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="" disabled>Select Year</option>
                                            <option value="2020">2020</option>
                                            <option value="2021">2021</option>
                                            <option value="2022">2022</option>
                                            <option value="2023">2023</option>
                                            <option value="2024">2024</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Rest of the form content */}
                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold" htmlFor="basicsalary">
                                    Basic Salary:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-3"
                                    id="basicsalary"
                                    type="number"
                                    name="basicsalary"
                                    value={salaryData.basicsalary}
                                    onChange={handleChange}
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
                                    type="number"
                                    name="othours"
                                    value={salaryData.othours}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otrate">
                                    OT Rate:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-9"
                                    id="otrate"
                                    type="number"
                                    name="otrate"
                                    value={salaryData.otrate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ottotal">
                                    OT Total:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-8"
                                    id="ottotal"
                                    type="number"
                                    name="ottotal"
                                    value={salaryData.ottotal}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>
                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bonus">
                                    Bonus:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-11"
                                    id="bonus"
                                    type="number"
                                    name="bonus"
                                    value={salaryData.bonus}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reduction">
                                    Reduction:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-5"
                                    id="reduction"
                                    type="number"
                                    name="reduction"
                                    value={salaryData.reduction}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="netsalary">
                                    Net Salary:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-5"
                                    id="netsalary"
                                    type="number"
                                    name="netsalary"
                                    value={salaryData.netsalary}
                                    onChange={handleChange}
                                    disabled
                                />
                            </div>

                            <div class="flex items-center space-x-6">
                                <button
                                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Assign
                                </button>
                                <button
                                    class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={handleClear}
                                >
                                    Clear
                                </button>
                            </div>
                        </form>

                        <div class="ml-3 mr-3">
                            <img src={salaryImage} alt="Add Salary" class="h-49 w-39" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}