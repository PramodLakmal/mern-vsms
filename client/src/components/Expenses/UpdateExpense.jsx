import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import DashSidebar from '../../components/DashSidebar'; // Import DashSidebar component

const UpdateExpense = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        _id: '',
        title: '',
        amount: '',
        type: '',
        date: '',
        description: ''
    });

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const response = await axios.get(`/api/Expense/${id}`);
                const expenseData = response.data;
                // Convert date format to "YYYY-MM-DD"
                const formattedDate = new Date(expenseData.date).toISOString().split('T')[0];
                setFormData({
                    _id: expenseData._id,
                    title: expenseData.title,
                    amount: expenseData.amount,
                    type: expenseData.type,
                    date: formattedDate,
                    description: expenseData.description
                });
            } catch (error) {
                console.error('Error fetching expense:', error);
            }
        };
        fetchExpense();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`/api/Expense/${id}`, formData);
            console.log('Expense updated successfully');
            window.alert('Expense updated successfully!');
            // Navigate back to Expenses page
            navigate('/dashboard?tab=Expenses');
        } catch (error) {
            console.error('Error updating expense:', error);
            window.alert('Error updating expense. Please try again.');
        }
    };

    return (
        <div className="flex bg-gray-200">
            <div className="min-h-screen flex">
                <DashSidebar />
            </div>
            <div className="ml-8 flex-1 pr-8">
                <div className="newContainer">
                    <div className="top shadow-md py-2 px-4 my-4 flex">
                        <h2 className="text-gray-600 font-bold text-lg flex-grow">Update Expense</h2>
                    </div>
                    <div className="bottom shadow-md p-4 flex justify-between">
                        <form onSubmit={handleSubmit} className="w-full lg:w-1/2">
                            <div className="flex items-center mb-4">
                                <label htmlFor="_id" className="block text-gray-700 text-sm font-bold mr-6">ExpenseID</label>
                                <input type="text" name="_id" value={formData._id} readOnly className="flex-grow border border-gray-300 text-gray-700 rounded px-4 py-2 bg-gray-100" />
                            </div>

                            <div className="flex items-center mb-4">
                                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mr-16">Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} className="flex-grow border border-gray-300 text-gray-700 rounded px-4 py-2" />
                            </div>
                            <div className="flex items-center mb-4">
                                <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mr-10">Amount</label>
                                <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="flex-grow border border-gray-300 text-gray-700 rounded px-4 py-2" />
                            </div>
                            <div className="flex items-center mb-4">
                                <label htmlFor="type" className="block text-gray-700 text-sm font-bold mr-16">Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="flex-grow border border-gray-300 text-gray-700 rounded px-4 py-2"
                                >
                                    <option value="">Select Type</option>
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
                                <label htmlFor="date" className="block text-gray-700 text-sm font-bold mr-16">Date</label>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} className="flex-grow border border-gray-300 text-gray-700 rounded px-4 py-2" />
                            </div>
                            <div className="flex items-center mb-4">
                                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mr-5">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="flex-grow border border-gray-300 text-gray-700 rounded px-4 py-2" />
                            </div>

                            <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Update Expense</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateExpense;
