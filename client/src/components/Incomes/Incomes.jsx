import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function Incomes() {
    const [incomes, setIncomes] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const navigate = useNavigate(); // Add useNavigate hook

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
        fetchIncomes();
    }, []);

    // Function to handle delete action
    const handleDelete = async (id) => {
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

    // Function to handle edit action
    const handleEdit = (id) => {
        // Implement your edit logic here
        console.log('Edit income with ID:', id);
        navigate(`/UpdateIncome/${id}`); // Navigate to UpdateIncome page with income ID
    };

    const generateIncomeReport = () => {
        try {
            const doc = new jsPDF(); // Initialize jsPDF
            doc.setFontSize(12);
            doc.text('Income Report', 10, 10);

            // Add table header row
            const headerCols = [
                'Income ID', 'Title', 'Amount', 'Type', 'Date', 'Description'
            ];
            const headerRowHeight = 5;
            const headerYPos = 15;

            const tableBody = incomes.map(income => ([
                income._id, income.title, `${income.amount}`, income.type,
                new Date(income.date).toLocaleDateString(), income.description
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

            // Add Total Income row at the bottom
            const totalIncomeRow = [
                '', '', '', '', 'Total Income:', `Rs.${totalIncome}`
            ];
            doc.autoTable({
                startY: doc.previousAutoTable.finalY + 10,
                head: [headerCols], // Using the same header columns for consistency
                body: [totalIncomeRow],
                showHead: 'never', // Hide header for the total income row
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
            doc.save('income_report.pdf');
        } catch (error) {
            console.error('Error generating income report:', error);
        }
    };



    return (
        <div className="flex">
            <div className="min-h-screen flex"></div>
            <div className="ml-8 flex-1 pr-8">
                <div className="newContainer">
                    <div className="top shadow-md py-2 px-4 my-4">
                        <h1 className="text-2xl font-bold mb-4">Incomes</h1>

                        <div className="flex justify-end items-center mb-4">
                            <button
                                type="button"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                onClick={generateIncomeReport}
                            >
                                Generate Income Report
                            </button>
                            <button
                                type="button"
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => navigate('/dashboard?tab=IncomeForm')}
                            >
                                Add New Income
                            </button>
                        </div>

                        <table className="full border-collapse border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="border border-gray-200 px-4 py-2">Income ID</th>
                                    <th className="border px-4 py-2">Title</th>
                                    <th className="border px-4 py-2">Amount</th>
                                    <th className="border px-4 py-2">Type</th>
                                    <th className="border px-4 py-2">Date</th>
                                    <th className="border px-4 py-2">Description</th>
                                    <th className="border px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incomes.map(income => (
                                    <tr key={income._id} >
                                        <td className="border border-gray-200 px-4 py-2">{income._id}</td>
                                        <td className="border px-4 py-2">{income.title}</td>
                                        <td className="border px-4 py-2">Rs.{income.amount}</td>
                                        <td className="border px-4 py-2">{income.type}</td>
                                        <td className="border px-4 py-2">{new Date(income.date).toLocaleDateString()}</td>
                                        <td className="border px-4 py-2">{income.description}</td>
                                        <td className="border px-4 py-2">
                                            <div className="flex">
                                                <Link to={`/UpdateIncome/${income._id}`}>
                                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded">Edit</button>
                                                </Link>
                                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDelete(income._id)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="2" className="text-right font-bold">Total Income:</td>
                                    <td colSpan="5" className="border-b px-4 py-2">Rs.{totalIncome}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Incomes;
