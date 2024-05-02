import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const IncomeForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        amount: '', // Initialize amount as an empty string
        type: '', // Initialize type as an empty string
        date: '',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Ensure amount is converted to a number before sending
            const dataToSend = { ...formData, amount: Number(formData.amount) };
            const response = await axios.post("/api/Income", dataToSend);
            console.log('Income added successfully:', response.data);
            window.alert('Income added successfully!');
            navigate('/dashboard?tab=Incomes');
        } catch (error) {
            console.error('Error adding income:', error);
            window.alert('Error adding income. Please try again.');
        }
    };
    return (
        <div className="flex justify-center bg-gray-200 w-full">
            <div className="min-h-screen flex"></div>
            <div className="ml-8 flex-1 pr-8">
                <div className="newContainer ml-0">
                    <div className="top shadow-md py-2 px-4 my-4 flex ">
                        <h1 className="text-gray-600 font-bold text-lg flex-grow">Add Income</h1>
                    </div>
                    <div className="bottom shadow-md p-4 flex justify-between">
                        <form onSubmit={handleSubmit} className="w-1/2">

                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mr-14" htmlFor="title">
                                    Title:
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Title"
                                    className="flex-grow border border-gray-300 text-gray-700  rounded px-4 py-2"
                                    required
                                />
                            </div>

                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mr-8" htmlFor="amount">
                                    Amount:
                                </label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="Amount"
                                    className="flex-grow border border-gray-300 text-gray-700  rounded px-4 py-2"
                                    required
                                />
                            </div>

                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mr-14" htmlFor="type">
                                    Type:
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="flex-grow border border-gray-300 text-gray-700 rounded px-4 py-2"
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option value="Service Charges">Service Charges</option>
                                    <option value="Vehicle Inspections">Vehicle Inspections</option>
                                    <option value="Item Sales">Item Sales</option>
                                    <option value="Diagnostic Fees">Diagnostic Fees</option>
                                    <option value="Warranty Claims">Warranty Claims</option>
                                    <option value="Miscellaneous Services">Miscellaneous Services</option>
                                </select>
                            </div>


                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mr-14" htmlFor="date">
                                    Date:
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    placeholder="date"
                                    className="flex-grow border border-gray-300 text-gray-700  rounded px-4 py-2"
                                    required
                                />
                            </div>

                            <div className="flex items-center mb-4" >
                                <label className="block text-gray-700 text-sm font-bold mr-3" htmlFor="description">
                                    Description:
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Description"
                                    className="flex-grow border border-gray-300 text-gray-700  rounded px-4 py-2 "
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncomeForm;
