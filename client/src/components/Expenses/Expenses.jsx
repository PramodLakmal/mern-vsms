import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FaSearch } from 'react-icons/fa';

function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [totalExpense, setTotalExpense] = useState(0);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const navigate = useNavigate(); // Add useNavigate hook

    // Function to fetch expenses
    const fetchExpenses = async () => {
        try {
            const response = await axios.get("/api/Expense");
            const allExpenses = response.data.reverse();
            setExpenses(allExpenses);
            setFilteredExpenses(allExpenses); // Initialize filtered list
            const total = allExpenses.reduce((acc, curr) => acc + curr.amount, 0);
            setTotalExpense(total);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    // Function to handle search input
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase(); // Lowercase for case-insensitive search
        setSearchQuery(query); // Update search query state

        const filtered = expenses.filter((expense) =>
            expense.title.toLowerCase().includes(query)
        );

        setFilteredExpenses(filtered); // Update filtered list
    };

    // Function to handle delete action
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/Expense/${id}`);
            fetchExpenses(); // Fetch expenses again after deletion
            alert('Deleted Successfully'); // Display alert message
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    // Function to handle edit action
    const handleEdit = (id) => {
        navigate(`/UpdateExpense/${id}`); // Navigate to UpdateExpense page with expense ID
    };

    // Function to generate expense report
    const generateExpenseReport = () => {
        try {
            const doc = new jsPDF(); // Initialize jsPDF
            doc.setFontSize(12);
            doc.text('Expense Report', 10, 10);

            const headerCols = [
                'Expense ID', 'Title', 'Amount', 'Type', 'Date', 'Description'
            ];

            const tableBody = filteredExpenses.map((expense) => [
                expense._id,
                expense.title,
                `${expense.amount}`,
                expense.type,
                new Date(expense.date).toLocaleDateString(),
                expense.description,
            ]);

            doc.autoTable({
                head: [headerCols],
                body: tableBody,
            });

            doc.save('expense_report.pdf'); // Save or download the report
        } catch (error) {
            console.error('Error generating expense report:', error);
        }
    };

    return (
        <div className="flex">
            <div className="min-h-screen flex"></div>
            <div className="ml-8 flex-1 pr-8">
                <div className="newContainer">
                    <div className="top shadow-md py-2 px-4 my-4">
                        <h1 className="text-2xl font-bold mb-4">Expenses</h1>

                        {/* Search bar */}
                        <div className="flex justify-between items-center mb-4">
<div className="relative w-64">
                            <input
                                type="text"
                                className="border p-2 rounded-full w-full pr-10 pl-4 text-gray-700"
                                placeholder="Search by Title"
                                value={searchQuery} // Bind to search query state
                                onChange={handleSearch} // Handle input change
                            />
<FaSearch
                                    className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                                />
                            </div>


                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={generateExpenseReport}
                                >
                                    Generate Report
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => navigate('/dashboard?tab=ExpenseForm')}
                                >
                                    Add Expense
                                </button>
                            </div>
                        </div>

                        <table className="border-collapse border border-gray-200 w-full">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Expense ID</th>
                                    <th className="border px-4 py-2">Title</th>
                                    <th className="border px-4 py-2">Amount</th>
                                    <th className="border px-4 py-2">Type</th>
                                    <th className="border px-4 py-2">Date</th>
                                    <th className="border px-4 py-2">Description</th>
                                    <th className="border px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExpenses.map((expense) => (
                                    <tr key={expense._id}>
                                        <td className="border px-4 py-2">{expense._id}</td>
                                        <td className="border px-4 py-2">{expense.title}</td>
                                        <td className="border px-4 py-2">Rs.{expense.amount}</td>
                                        <td className="border px-4 py-2">{expense.type}</td>
                                        <td className="border px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                                        <td className="border px-4 py-2">{expense.description}</td>
                                        <td className="border px-4 py-2">
                                            <div className="flex space-x-2">
                                                <Link to={`/UpdateExpense/${expense._id}`}>
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                    >
                                                        Edit
                                                    </button>
                                                </Link>
                                                <button
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                    onClick={() => handleDelete(expense._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="2" className="text-right font-bold">Total Expense:</td>
                                    <td colSpan="5" className="border px-4 py-2">Rs.{totalExpense}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Expenses;