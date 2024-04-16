import React, { useState, useEffect } from 'react';

const DashTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">All Transactions</h1>
      <div className="overflow-x-auto">
        <table className="table w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Customer Name</th>
              <th className="px-4 py-2">Customer Mobile</th>
              <th className="px-4 py-2">Total Amount</th>
              <th className="px-4 py-2">Date Created</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction._id}>
                <td className="px-4 py-2">{transaction.userId ? transaction.userId.username : transaction.customerName || 'N/A'}</td>
                <td className="px-4 py-2">{transaction.userId ? transaction.userId.mobile : transaction.customerMobile || 'N/A'}</td>
                <td className="px-4 py-2">{transaction.totalAmount}</td>
                <td className="px-4 py-2">{new Date(transaction.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashTransactions;