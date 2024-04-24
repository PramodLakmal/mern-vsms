import React, { useState, useEffect } from 'react';
import { Table } from 'flowbite-react';

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
        <Table hoverable className="w-full table-auto">
          <Table.Head>
              <Table.HeadCell >Customer Name</Table.HeadCell>
              <Table.HeadCell >Customer Mobile</Table.HeadCell>
              <Table.HeadCell >Total Amount</Table.HeadCell>
              <Table.HeadCell >Date Created</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {transactions.map(transaction => (
              <Table.Row key={transaction._id}>
                <Table.Cell >{transaction.userId ? transaction.userId.username : transaction.customerName || 'N/A'}</Table.Cell>
                <Table.Cell >{transaction.userId ? transaction.userId.phoneNumber : transaction.customerMobile || 'N/A'}</Table.Cell>
                <Table.Cell >{transaction.totalAmount}</Table.Cell>
                <Table.Cell >{new Date(transaction.createdAt).toLocaleString()}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default DashTransactions;
