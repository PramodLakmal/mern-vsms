import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [totalExpense, setTotalExpense] = useState(0);
    const navigate = useNavigate(); // Add useNavigate hook

    // Function to fetch expenses
    const fetchExpenses = async () => {
        try {
            const response = await axios.get("/api/Expense");
            setExpenses(response.data.reverse());
            // Calculate total expense
            const total = response.data.reduce((acc, curr) => acc + curr.amount, 0);
            setTotalExpense(total);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    // Function to handle delete action
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/Expense/${id}`);
            // Fetch expenses again after deletion
            fetchExpenses();
            // Display alert message
            alert('Deleted Successfully');
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    // Function to handle edit action
    const handleEdit = (id) => {
        // Implement your edit logic here
        console.log('Edit expense with ID:', id);
        navigate(`/UpdateExpense/${id}`); // Navigate to UpdateExpense page with expense ID
    };

    const generateExpenseReport = () => {
        try {
            const doc = new jsPDF(); // Initialize jsPDF
            doc.setFontSize(12);
            doc.text('Expense Report', 10, 10);

            // Add table header row
            const headerCols = [
                'Expense ID', 'Title', 'Amount', 'Type', 'Date', 'Description'
            ];
            const headerRowHeight = 5;
            const headerYPos = 15;

            const tableBody = expenses.map(expense => ([
                expense._id, expense.title, `${expense.amount}`, expense.type,
                new Date(expense.date).toLocaleDateString(), expense.description
            ]));
            doc.autoTable({
                startY: headerYPos,
                head: [headerCols],
                body: tableBody,
                didDrawCell: (data) => {
                    if (data.column.index === 4 && data.cell.raw === 'Date') {
                        // Adjusting the Date column width to fit only the date
                        data.cell.width = 35;
                    }
                }
            });

            // Add Total Expense row at the bottom
            const totalExpenseRow = [
                '', '', '', '', 'Total Expense:', `Rs.${totalExpense}`
            ];
            doc.autoTable({
                startY: doc.previousAutoTable.finalY + 10,
                head: [headerCols], // Using the same header columns for consistency
                body: [totalExpenseRow],
                showHead: 'never', // Hide header for the total expense row
                theme: 'plain', // Using plain theme for a simpler appearance
                styles: {
                    cellPadding: 1,
                    fontSize: 12
                }
            });

            // Calculate the end Y position of the table manually
            const endY = headerYPos + doc.previousAutoTable.finalY;

            // Add additional report information (optional)
            const additionalInfoYPos = endY + 5;
            doc.text('Report generated on:', 10, additionalInfoYPos);
            doc.text(new Date().toLocaleDateString(), 50, additionalInfoYPos);

            // Save or download the report
            doc.save('expense_report.pdf');
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

                        <div className="flex justify-end items-center mb-4">
                            <button
                                type="button"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                onClick={generateExpenseReport}
                            >
                                Generate Expense Report
                            </button>
                            <button
                                type="button"
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => navigate('/dashboard?tab=ExpenseForm')}
                            >
                                Add New Expense
                            </button>
                        </div>
                        <table className="full border-collapse border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="border border-gray-200 px-4 py-2">Expense ID</th>
                                    <th className="border px-4 py-2">Title</th>
                                    <th className="border px-4 py-2">Amount</th>
                                    <th className="border px-4 py-2">Type</th>
                                    <th className="border px-4 py-2">Date</th>
                                    <th className="border px-4 py-2">Description</th>
                                    <th className="border px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map(expense => (
                                    <tr key={expense._id} >
                                        <td className="border border-gray-200 px-4 py-2">{expense._id}</td>
                                        <td className="border px-4 py-2">{expense.title}</td>
                                        <td className="border px-4 py-2">{expense.amount}</td>
                                        <td className="border px-4 py-2">{expense.type}</td>
                                        <td className="border px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                                        <td className="border px-4 py-2">{expense.description}</td>
                                        <td className="border px-4 py-2">
                                            <Link to={`/UpdateExpense/${expense._id}`}>
                                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded">Edit</button>
                                            </Link>
                                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDelete(expense._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="2" className="text-right font-bold">Total Expense:</td>
                                    <td colSpan="5" className="border-b px-4 py-2">Rs.{totalExpense}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Expenses;
