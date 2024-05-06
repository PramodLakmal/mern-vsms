import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FaSearch } from 'react-icons/fa';

function Incomes() {
    const [incomes, setIncomes] = useState([]);
    const [filteredIncomes, setFilteredIncomes] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [searchQuery, setSearchQuery] = useState(''); // State for the search query
    const navigate = useNavigate(); // Add useNavigate hook

    // Function to fetch incomes
    const fetchIncomes = async () => {
        try {
            const response = await axios.get('/api/Income');
            const allIncomes = response.data.reverse();
            setIncomes(allIncomes);
            setFilteredIncomes(allIncomes); // Initially, the filtered list is the same as the complete list
            // Calculate total income
            const total = allIncomes.reduce((acc, curr) => acc + curr.amount, 0);
            setTotalIncome(total);
        } catch (error) {
            console.error('Error fetching incomes:', error);
        }
    };

    useEffect(() => {
        fetchIncomes();
    }, []);

    // Function to handle search
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase(); // Convert query to lowercase for case-insensitive search
        setSearchQuery(query);
        const filtered = incomes.filter((income) => income.title.toLowerCase().includes(query));
        setFilteredIncomes(filtered); // Update the filtered list
    };

    // Function to handle delete action
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/Income/${id}`);
            fetchIncomes(); // Fetch incomes again after deletion
            alert('Deleted Successfully'); // Display alert message
        } catch (error) {
            console.error('Error deleting income:', error);
        }
    };

    // Function to handle edit action
    const handleEdit = (id) => {
        navigate(`/UpdateIncome/${id}`); // Navigate to UpdateIncome page with income ID
    };

    // Function to generate income report
    const generateIncomeReport = () => {
        try {
            const doc = new jsPDF(); // Initialize jsPDF
            doc.setFontSize(12);
            doc.text('Income Report', 10, 10);

            const headerCols = ['Income ID', 'Title', 'Amount', 'Type', 'Date', 'Description'];
            const tableBody = filteredIncomes.map((income) => [
                income._id,
                income.title,
                `${income.amount}`,
                income.type,
                new Date(income.date).toLocaleDateString(),
                income.description,
            ]);

            doc.autoTable({
                head: [headerCols],
                body: tableBody,
            });

            // Add Total Income row at the bottom
            doc.autoTable({
                head: [['', '', '', '', 'Total Income:', `Rs.${totalIncome}`]],
                body: [],
                showHead: 'never',
                theme: 'plain', // Using plain theme for a simpler appearance
            });

            doc.save('income_report.pdf'); // Save or download the report
        } catch (error) {
            console.error('Error generating income report:', error);
        }
    };

    return (
        <div className="flex">
            <div className="ml-8 flex-1 pr-8">
                
                    <div className="top shadow-md py-2 px-4 my-4">
                        <h1 className="text-2xl font-bold mb-4">Incomes</h1>

                        {/* Search bar */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="relative w-64">
                                <input
                                    type="text"
                                    className="border p-2 rounded-full w-full pr-10 pl-4 text-gray-700"
                                    placeholder="Search by Title"
                                    value={searchQuery}
                                    onChange={handleSearch} // Handle input change
                                />
                                <FaSearch
                                    className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                                />
                            </div>
                            <div className="flex space-x-4"> {/* Adjusted spacing between buttons */}
                                <button
                                    type="button"
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={generateIncomeReport}
                                >
                                    Generate Income Report
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => navigate('/dashboard?tab=IncomeForm')}
                                >
                                    Add New Income
                                </button>
                            </div>
                        </div>

                        <table className="border-collapse border border-gray-200 w-full">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Income ID</th>
                                    <th className="border px-4 py-2">Title</th>
                                    <th className="border px-4 py-2">Amount</th>
                                    <th className="border px-4 py-2">Type</th>
                                    <th className="border px-4 py-2">Date</th>
                                    <th className="border px-4 py-2">Description</th>
                                    <th className="border px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredIncomes.map((income) => (
                                    <tr key={income._id}>
                                        <td className="border px-4 py-2">{income._id}</td>
                                        <td className="border px-4 py-2">{income.title}</td>
                                        <td className="border px-4 py-2">Rs.{income.amount}</td>
                                        <td className="border px-4 py-2">{income.type}</td>
                                        <td className="border px-4 py-2">{new Date(income.date).toLocaleDateString()}</td>
                                        <td className="border px-4 py-2">{income.description}</td>
                                        <td className="border px-4 py-2">
                                            <div className="flex space-x-2"> {/* Spacing between buttons */}
                                                <Link to={`/UpdateIncome/${income._id}`}>
                                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button>
                                                </Link>
                                                <button
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                    onClick={() => handleDelete(income._id)}
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
                                    <td colSpan="6" className="text-right font-bold">Total Income:</td>
                                    <td className="border px-4 py-2">Rs.{totalIncome}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        
    );
}

export default Incomes;