import React, { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import { FiDownload } from "react-icons/fi";

const DashRefunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null); // State to hold selected date

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      const response = await fetch("/api/refunds");
      const data = await response.json();
      setRefunds(data.refunds);
    } catch (error) {
      console.error("Error fetching refunds:", error);
    }
  };

  const handleDownloadCSVReport = async () => {
    try {
      const response = await fetch("/api/refunds/csv-report");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "refunds_report.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV report:", error);
    }
  };

  const handleDownloadPDFReport = async () => {
    try {
      const response = await fetch("/api/refunds/pdf-report");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "refunds_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF report:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);
  };

  const handleClearDate = () => {
    setSelectedDate(null);
  };

  const filteredRefunds = refunds.filter(
    (refund) =>
      refund.appointmentId.userId.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (!selectedDate ||
        new Date(refund.dateIssued).toLocaleDateString() ===
          new Date(selectedDate).toLocaleDateString())
  );

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Refund Details</h1>

      <div className="flex mb-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="date"
            max={today} // Set maximum date to today's date
            onChange={handleDateChange}
            value={selectedDate || ""}
            className="p-2 rounded border dark:border-gray-700 dark:bg-gray-800 dark:text-white border-gray-300 bg-white text-black"
          />

          {selectedDate && (
            <button
              onClick={handleClearDate}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Clear Date
            </button>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleDownloadCSVReport}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FiDownload className="mr-2" />
            Download CSV Report
          </button>
          <button
            onClick={handleDownloadPDFReport}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FiDownload className="mr-2" />
            Download PDF Report
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by username"
        value={searchTerm}
        onChange={handleSearch}
        className="p-2 mb-4 rounded border dark:border-gray-700 dark:bg-gray-800 dark:text-white border-gray-300 bg-white text-black"
      />

      <Table hoverable className="w-full table-auto">
        <Table.Head>
          <Table.HeadCell>User Name</Table.HeadCell>
          <Table.HeadCell>Service Name</Table.HeadCell>
          <Table.HeadCell>Refund Amount</Table.HeadCell>
          <Table.HeadCell>Refund Date</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {filteredRefunds.map((refund) => (
            <Table.Row key={refund._id}>
              <Table.Cell>{refund.appointmentId.userId.username}</Table.Cell>
              <Table.Cell>{refund.appointmentId.serviceId.name}</Table.Cell>
              <Table.Cell>{refund.refundedAmount}</Table.Cell>
              <Table.Cell>
                {new Date(refund.dateIssued).toLocaleDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default DashRefunds;
