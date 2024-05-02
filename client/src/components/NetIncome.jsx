import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function NetIncome() {
    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);
    const [totalExpense, setTotalExpense] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [netIncome, setNetIncome] = useState(0);
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

    // Function to fetch incomes
    const fetchIncomes = async () => {
        try {
            const response = await axios.get("/api/Income");
            setIncomes(response.data.reverse());
            // Calculate total income
            const total = response.data.reduce((acc, curr) => acc + curr.amount, 0);
            setTotalIncome(total);
        } catch (error) {
            console.error('Error fetching incomes:', error);
        }
    };

    useEffect(() => {
        fetchExpenses();
        fetchIncomes();
    }, []);

    // Calculate net income
    useEffect(() => {
        const net = totalIncome - totalExpense;
        setNetIncome(net);
    }, [totalIncome, totalExpense]);

    // Function to handle delete action for expenses
    const handleDeleteExpense = async (id) => {
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

    // Function to handle delete action for incomes
    const handleDeleteIncome = async (id) => {
        try {
            await axios.delete(`/api/Income/${id}`);
            // Fetch incomes again after deletion
            fetchIncomes();
            // Display alert message
            alert('Deleted Successfully');
        } catch (error) {
            console.error('Error deleting income:', error);
        }
    };

    // Function to handle edit action for expenses
    const handleEditExpense = (id) => {
        console.log('Edit expense with ID:', id);
        navigate(`/UpdateExpense/${id}`); // Navigate to UpdateExpense page with expense ID
    };

    // Function to handle edit action for incomes
    const handleEditIncome = (id) => {
        console.log('Edit income with ID:', id);
        navigate(`/UpdateIncome/${id}`); // Navigate to UpdateIncome page with income ID
    };

    // Function to generate net income report
    const generateNetIncomeReport = () => {
        try {
            const doc = new jsPDF(); // Initialize jsPDF
            doc.setFontSize(12);
            doc.text('Net Income Report', 10, 10);

            // Add table header row
            const headerCols = [
                'ID', 'Title', 'Type', 'Date', 'Description', 'Amount'
            ];
            const headerRowHeight = 5;
            const headerYPos = 15;

            // Combine incomes and expenses into one array for the report
            const reportData = [...incomes, ...expenses].map(item => ([
                item._id, item.title, item.type,
                new Date(item.date).toLocaleDateString(), item.description, item.amount
            ]));

            doc.autoTable({
                startY: headerYPos,
                head: [headerCols],
                body: reportData,
                didDrawCell: (data) => {
                    if (data.column.index === 3 || data.column.index === 5) {
                        // Adjusting the Date and Amount column width
                        data.cell.width = 35;
                    }
                }
            });

            // Calculate the end Y position of the table manually
            const endY = headerYPos + doc.previousAutoTable.finalY;

            // Add total income, total expense, and net income rows
            const totalRowsYPos = endY + 10;
            doc.text(`Total Income: ${totalIncome}`, 10, totalRowsYPos);
            doc.text(`Total Expense: ${totalExpense}`, 10, totalRowsYPos + 5);
            doc.text(`Net Income: Rs.${netIncome}`, 10, totalRowsYPos + 10);

            // Add additional report information (optional)
            const additionalInfoYPos = totalRowsYPos + 25;
            doc.text('Report generated on:', 10, additionalInfoYPos);
            doc.text(new Date().toLocaleDateString(), 50, additionalInfoYPos);

            // Save or download the report
            doc.save('net_income_report.pdf');
        } catch (error) {
            console.error('Error generating net income report:', error);
        }
    };


    return (
        <div className="flex">
            <div className="min-h-screen flex"></div>
            <div className="ml-8 flex-1 pr-8">
                <div className="newContainer">
                    <div className="top shadow-md py-2 px-4 my-4">
                        <h1 className="text-2xl font-bold mb-4">Net Income</h1>

                        <table className="full border-collapse border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="border border-gray-200 px-4 py-2">ID</th>
                                    <th className="border px-4 py-2">Title</th>
                                    <th className="border px-4 py-2">Type</th>
                                    <th className="border px-4 py-2">Date</th>
                                    <th className="border px-4 py-2">Description</th>
                                    <th className="border px-4 py-2">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Display Incomes */}
                                {incomes.map(income => (
                                    <tr key={income._id} >
                                        <td className="border border-gray-200 px-4 py-2">{income._id}</td>
                                        <td className="border px-4 py-2">{income.title}</td>
                                        <td className="border px-4 py-2">{income.type}</td>
                                        <td className="border px-4 py-2">{new Date(income.date).toLocaleDateString()}</td>
                                        <td className="border px-4 py-2">{income.description}</td>
                                        <td className="border px-4 py-2">{income.amount}</td>
                                    </tr>
                                ))}

                                {/* Display Total Income */}
                                <tr>
                                    <td colSpan="5" className="text-right font-bold">Total Income:</td>
                                    <td className="border-b px-4 py-2">{totalIncome}</td>
                                </tr>
                                {/* Display Expenses */}
                                {expenses.map(expense => (
                                    <tr key={expense._id} >
                                        <td className="border border-gray-200 px-4 py-2">{expense._id}</td>
                                        <td className="border px-4 py-2">{expense.title}</td>
                                        <td className="border px-4 py-2">{expense.type}</td>
                                        <td className="border px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                                        <td className="border px-4 py-2">{expense.description}</td>
                                        <td className="border px-4 py-2">{expense.amount}</td>
                                    </tr>
                                ))}

                                {/* Display Total Expense */}
                                <tr>
                                    <td colSpan="5" className="text-right font-bold">Total Expense:</td>
                                    <td className="border-b px-4 py-2">-{totalExpense}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                {/* Horizontal line */}
                                <tr>
                                    <td colSpan="6" className="border-t border-gray-200">&nbsp;</td>
                                </tr>
                                {/* Display Net Income */}
                                <tr>
                                    <td colSpan="5" className="text-right font-bold">Net Income:</td>
                                    <td className="border-b px-4 py-2">Rs.{netIncome}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="flex justify-end items-center mb-4">
                        <button
                            type="button"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                            onClick={generateNetIncomeReport}
                        >
                            Generate Net Income Report
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default NetIncome;
