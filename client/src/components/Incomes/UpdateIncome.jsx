import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import DashSidebar from '../../components/DashSidebar'; // Import DashSidebar component

const UpdateIncome = () => {
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
        const fetchIncome = async () => {
            try {
                const response = await axios.get(`/api/Income/${id}`);
                const incomeData = response.data;
                // Convert date format to "YYYY-MM-DD"
                const formattedDate = new Date(incomeData.date).toISOString().split('T')[0];
                setFormData({
                    _id: incomeData._id,
                    title: incomeData.title,
                    amount: incomeData.amount,
                    type: incomeData.type,
                    date: formattedDate,
                    description: incomeData.description
                });
            } catch (error) {
                console.error('Error fetching income:', error);
            }
        };
        fetchIncome();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`/api/Income/${id}`, formData);
            console.log('Income updated successfully');
            window.alert('Income updated successfully!');
            // Navigate back to Incomes page
            navigate('/dashboard?tab=Incomes');
        } catch (error) {
            console.error('Error updating income:', error);
            window.alert('Error updating income. Please try again.');
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
                        <h2 className="text-gray-600 font-bold text-lg flex-grow">Update Income</h2>
                    </div>
                    <div className="bottom shadow-md p-4 flex justify-between">
                        <form onSubmit={handleSubmit} className="w-full lg:w-1/2">
                            <div className="flex items-center mb-4">
                                <label htmlFor="_id" className="block text-gray-700 text-sm font-bold mr-6">Income ID</label>
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
                                    <option value="Service Charges">Service Charges</option>
                                    <option value="Vehicle Inspections">Vehicle Inspections</option>
                                    <option value="Item Sales">Item Sales</option>
                                    <option value="Diagnostic Fees">Diagnostic Fees</option>
                                    <option value="Warranty Claims">Warranty Claims</option>
                                    <option value="Miscellaneous Services">Miscellaneous Services</option>
                                </select>
                            </div>

                            <div className="flex items-center mb-4">
                                <label htmlFor="date" className="block text-gray-700 text-sm font-bold mr-16">Date</label>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} className="flex-grow border border-gray-300 text-gray-700 rounded px-4 py-2" />
                            </div>
                            <div className="flex items-center mb-4">
                                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mr-4">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="flex-grow border border-gray-300 text-gray-700 rounded px-4 py-2" />
                            </div>

                            <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Update Income</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateIncome;
