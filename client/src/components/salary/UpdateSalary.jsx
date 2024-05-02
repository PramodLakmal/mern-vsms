import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import DashSidebar from '../../components/DashSidebar';
import updateSalaryImage from '../../public/updatesalary.png';

export default function UpdateSalary() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [salaryData, setSalaryData] = useState({
        employeeid: '',
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'othours' || name === 'otrate') {
            // Calculate otTotal when othours or otrate changes
            const otHours = name === 'othours' ? parseInt(value) : parseInt(salaryData.othours || 0);
            const otRate = name === 'otrate' ? parseInt(value) : parseInt(salaryData.otrate || 0);
            const otTotal = isNaN(otHours) || isNaN(otRate) ? '' : otHours * otRate;

            // Calculate net salary
            const basicSalary = parseInt(salaryData.basicsalary || 0);
            const bonus = parseInt(salaryData.bonus || 0);
            const reduction = parseInt(salaryData.reduction || 0);
            const netSalary = basicSalary + (isNaN(otTotal) ? 0 : otTotal) + bonus - reduction;

            setSalaryData(prevState => ({
                ...prevState,
                ottotal: isNaN(otTotal) ? '' : otTotal.toString(),
                [name]: value,
                netsalary: isNaN(netSalary) ? '' : netSalary.toString()
            }));
        } else if (name === 'basicsalary' || name === 'bonus' || name === 'reduction' || name === 'month' || name === 'year') {
            // Recalculate netsalary when basicsalary, bonus, reduction, month, or year changes
            const basicSalary = parseInt(name === 'basicsalary' ? value : salaryData.basicsalary || 0);
            const bonus = parseInt(name === 'bonus' ? value : salaryData.bonus || 0);
            const reduction = parseInt(name === 'reduction' ? value : salaryData.reduction || 0);
            const otHours = parseInt(salaryData.othours || 0);
            const otRate = parseInt(salaryData.otrate || 0);
            const otTotal = isNaN(otHours) || isNaN(otRate) ? '' : otHours * otRate;
            const netSalary = basicSalary + (isNaN(otTotal) ? 0 : otTotal) + bonus - reduction;

            setSalaryData(prevState => ({
                ...prevState,
                [name]: value,
                ottotal: isNaN(otTotal) ? '' : otTotal.toString(),
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
            await axios.patch(`/api/salary/${id}`, salaryData);
            console.log('Salary updated successfully');
            window.alert('Salary updated successfully!');
            navigate('/dashboard?tab=SalaryList');
        } catch (error) {
            console.error('Error updating salary:', error);
            window.alert('Error updating salary. Please try again.');
        }
    };

    return (
        <div className="flex justify-center bg-gray-200 w-full">
            <div className="min-h-screen flex">
                <DashSidebar />
            </div>
            <div className="ml-8 flex-1 pr-8">
                <div className="newContainer ml-0">
                    <div className="top shadow-md py-2 px-4 my-4 flex ">
                        <h1 className="text-gray-600 font-bold text-lg flex-grow">Update Salary</h1>
                    </div>
                    <div className="bottom shadow-md p-4 flex justify-between">
                        <form onSubmit={handleSubmit} className="w-1/2">
                            <div className="flex flex-wrap gap-8 justify-between mb-4">
                                <div className="w-full flex">
                                    <div className="w-1/2 pr-2 ">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="employeeid">
                                            Employee ID
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="employeeid"
                                            type="text"
                                            name="employeeid"
                                            value={salaryData.employeeid}
                                            onChange={handleChange}
                                            readOnly // Make it read-only
                                        />
                                    </div>
                                    <div className="w-1/10 pl-1">
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

                                    <div className="w-1/10 pl-2">
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
                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="basicsalary">
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
                                />
                            </div>
                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otrate">
                                    OT Rate:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-1/3  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-9"
                                    id="otrate"
                                    type="number"
                                    name="otrate"
                                    value={salaryData.otrate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ottotal">
                                    OT Total:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-1/3  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-8"
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
                                    className="shadow appearance-none border rounded w-1/3  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-11"
                                    id="bonus"
                                    type="number"
                                    name="bonus"
                                    value={salaryData.bonus}
                                    onChange={handleChange}
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
                                    readOnly
                                />
                            </div>

                            <div className="flex items-center pl-20">
                                <button
                                    type="submit"
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                        <div className="ml-3 mr-3">
                            <img src={updateSalaryImage} alt="Update Salary" className="h-90 w-90" /> {/* Adjust the height and width of the image */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
