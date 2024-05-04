import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register required components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const IncomeChart = () => {
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);

    useEffect(() => {
        // Fetch expenses and calculate total expense
        const fetchExpenses = async () => {
            try {
                const response = await axios.get('/api/Expense');
                const total = response.data.reduce((acc, curr) => acc + curr.amount, 0);
                setTotalExpense(total);
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        // Fetch incomes and calculate total income
        const fetchIncomes = async () => {
            try {
                const response = await axios.get('/api/Income');
                const total = response.data.reduce((acc, curr) => acc + curr.amount, 0);
                setTotalIncome(total);
            } catch (error) {
                console.error('Error fetching incomes:', error);
            }
        };

        fetchExpenses();
        fetchIncomes();
    }, []); // Empty dependency array ensures the effect runs once on component mount

    // Data for the pie chart
    const chartData = {
        labels: ['Total Income', 'Total Expense'],
        datasets: [
            {
                label: 'Income vs Expense',
                data: [totalIncome, totalExpense], // Data for the pie chart
                backgroundColor: ['#36A2EB', '#FF6384'], // Blue for income, red for expense
                hoverOffset: 4, // Hover offset for 3D effect
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top', // Position of the legend
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const label = tooltipItem.label;
                        const value = tooltipItem.raw;
                        return `${label}: Rs.${value.toLocaleString()}`; // Format with currency symbol
                    },
                },
            },
        },
    };

    return (
        <div
            className="flex"
            style={{ height: '100vh', width: '100%' }}
        >

            <div className="w-full">

                <div className="top shadow-md py-1 px-1 my-2 flex justify-center"> {/* Right-align the heading */}
                    <h2 className="text-2xl font-bold mb-4">Income & Expense Chart</h2>
                </div>
                <div
                    className="flex justify-center top shadow-md py-1 px-1 my-2" // Keep the Pie chart centered
                >
                    <div
                        style={{ height: '600px', width: '600px' }}
                    >
                        <Pie data={chartData} options={options} />
                    </div>
                </div>
            </div>
        </div>

    );
};


export default IncomeChart;