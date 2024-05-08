import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExpenseForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        type: '',
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
            const response = await axios.post("/api/Expense", dataToSend);
            console.log('Expense added successfully:', response.data);
            window.alert('Expense added successfully!');
            navigate('/dashboard?tab=Expenses');
        } catch (error) {
            console.error('Error adding expense:', error);
            window.alert('Error adding expense. Please try again.');
        }
    };

    return (
        <div className="flex justify-center bg-gray-200 w-full">
            <div className="min-h-screen flex"></div>
            <div className="ml-8 flex-1 pr-8">
                <div className="newContainer ml-0">
                    <div className="top shadow-md py-2 px-4 my-4 flex ">
                        <h1 className="text-gray-600 font-bold text-lg flex-grow">Add Expense</h1>
                    </div>
                    <div className="bottom shadow-md p-4 flex justify-between">
                        <form onSubmit={handleSubmit} className="w-1/2">

                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mr-16" htmlFor="title">
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
                                <label className="block text-gray-700 text-sm font-bold mr-10" htmlFor="amount">
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
                                <label className="block text-gray-700 text-sm font-bold mr-16" htmlFor="type">
                                    Type:
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="flex-grow border border-gray-300 text-gray-700 rounded px-4 py-2"
                                    required
                                >
                                    <option value="">Select Expense Type</option>
                                    <option value="Parts and Materials">Parts and Materials</option>
                                    <option value="Labor Costs">Labor Costs</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Advertising and Marketing">Advertising and Marketing</option>
                                    <option value="Taxes and Licenses">Taxes and Licenses</option>
                                    <option value="Software and Technology">Software and Technology</option>
                                    <option value="Facility Maintenance">Facility Maintenance</option>
                                </select>
                            </div>


                            <div className="flex items-center mb-4">
                                <label className="block text-gray-700 text-sm font-bold mr-16" htmlFor="date">
                                    Date:
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    placeholder="Date"
                                    className="flex-grow border border-gray-300 text-gray-700  rounded px-4 py-2"
                                    required
                                />
                            </div>

                            <div className="flex items-center mb-4" >
                                <label className="block text-gray-700 text-sm font-bold mr-4" htmlFor="description">
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

export default ExpenseForm;