import React, { useState, useEffect } from "react";
import { Modal, Button, Table } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiOutlineSearch, HiOutlineExclamationCircle } from "react-icons/hi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DashNotice = () => {
  const [notices, setNotices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [newNotice, setNewNotice] = useState({
    NoticeID: "",
    Title: "",
    Date: "",
    NoticeType: "",
    Description: "",
  });
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch("/api/notice/all");
      if (!response.ok) {
        throw new Error(`Error fetching notices: ${response.statusText}`);
      }
      const data = await response.json();
      setNotices(data.notices || []);
    } catch (error) {
      console.error("Error fetching notices:", error);
      toast.error("Error fetching notices. Please try again later.");
    }
  };

  const showToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleAddModalOpen = () => {
    setShowAddModal(true);
    setSelectedNotice(null);
    setNewNotice({
      NoticeID: "",
      Title: "",
      Date: "",
      NoticeType: "",
      Description: "",
    });
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
  };

  const handleAddNotice = async () => {
    try {
      const response = await fetch("/api/notice/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNotice),
      });
      if (response.ok) {
        fetchNotices();
        handleAddModalClose();
        showToast("Notice added successfully!");
      } else {
        console.error("Failed to add notice");
        toast.error("Failed to add notice. Please try again.");
      }
    } catch (error) {
      console.error("Error adding notice:", error);
      toast.error("Error adding notice. Please try again later.");
    }
  };

  const handleUpdateModalOpen = (notice) => {
    setSelectedNotice(notice);
    setShowAddModal(true);
    setNewNotice(notice);
  };

  const handleUpdateNotice = async () => {
    try {
      const response = await fetch(`/api/notice/update/${selectedNotice._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNotice),
      });
      if (response.ok) {
        fetchNotices();
        handleAddModalClose();
        showToast("Notice updated successfully!");
      } else {
        console.error("Failed to update notice");
        toast.error("Failed to update notice. Please try again.");
      }
    } catch (error) {
      console.error("Error updating notice:", error);
      toast.error("Error updating notice. Please try again later.");
    }
  };

  const handleDeleteNotice = async (id) => {
    setSelectedNotice(id);
    setShowConfirmationDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`/api/notice/${selectedNotice}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchNotices();
        setShowConfirmationDialog(false);
        showToast("Notice deleted successfully!");
      } else {
        console.error("Failed to delete notice");
        toast.error("Failed to delete notice. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting notice:", error);
      toast.error("Error deleting notice. Please try again later.");
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmationDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNotice((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    const filteredNotices = notices.filter((notice) =>
      notice.Date.includes(searchQuery)
    );
    setNotices(filteredNotices);
    setSearchQuery("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const generateCsvData = (data) => {
    const header = ["Notice ID", "Title", "Date", "Notice Type", "Description"];
    const csvRows = [];
    csvRows.push(header.join(","));
    data.forEach((notice) => {
      const row = [
        notice.NoticeID,
        `"${notice.Title}"`,
        notice.Date,
        notice.NoticeType,
        `"${notice.Description}"`,
      ];
      csvRows.push(row.join(","));
    });
    return csvRows.join("\n");
  };

  const generateReport = async () => {
    try {
      if (notices.length === 0) {
        throw new Error("No notices to generate report.");
      }
  
      const pdf = new jsPDF("p", "pt", "letter");
      const table = document.querySelector("table");
  
      // Remove the last column (actions) from the table
      const rows = table.querySelectorAll("tr");
      rows.forEach((row) => row.deleteCell(-1));
  
      // Change table style for PDF
      table.style.backgroundColor = "white"; // Change background color
      table.style.color = "black"; // Change text color
  
      // Render table as image using html2canvas
      const canvas = await html2canvas(table);
      const imgData = canvas.toDataURL("image/png");
  
      // Calculate dimensions to fit entire table in PDF
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
      // Add image to PDF
      pdf.addImage(imgData, "PNG", 40, 40, pdfWidth - 80, pdfHeight - 100);
  
      // Save PDF
      pdf.save("notices_report.pdf");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Error generating report. Please try again.");
    }
  };
  
  
  return (
    <div className="container mx-auto p-5 relative">
      <ToastContainer />

      <div className="flex mb-4">
        <Button
          onClick={handleAddModalOpen}
          className="mr-2 bg-blue-500 text-white hover:bg-green-700"
        >
          Add Notice
        </Button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by date"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border p-2 pl-10 rounded  text-gray-600"
          />
          <HiOutlineSearch
            className="absolute top-3 left-2 text-gray-600"
            style={{ pointerEvents: "none" }}
          />
        </div>
        <Button
          onClick={handleSearch}
          className="bg-green-500 text-white hover:bg-green-700 ml-2"
        >
          Search
        </Button>
        <Button
          onClick={generateReport}
          className="bg-yellow-500 text-white hover:bg-yellow-700 ml-2"
        >
          Generate Report
        </Button>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        All Notices
      </h2>

      {notices && notices.length > 0 ? (
        <Table className="w-auto table-auto">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-2">Notice ID</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Notice Type</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice) => (
              <tr key={notice._id}>
                <td className="px-4 py-2">{notice._id}</td>
                <td className="px-4 py-2">{notice.Title}</td>
                <td className="px-4 py-2">{notice.Date}</td>
                <td className="px-4 py-2">{notice.NoticeType}</td>
                <td className="px-4 py-2">{notice.Description}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Button
                    color="green"
                    onClick={() => handleUpdateModalOpen(notice)}
                  >
                    Update
                  </Button>
                  <Button
                    color="red"
                    onClick={() => handleDeleteNotice(notice._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No notices found</p>
      )}

      <Modal
        show={showAddModal}
        onClose={handleAddModalClose}
        popup
        size="lg"
      >
        <Modal.Header>
          {selectedNotice ? "Update Notice" : "Add Notice"}
        </Modal.Header>
        <Modal.Body className="grid grid-cols-2 gap-2">
          <div className="mb-4 col-span-2">
            <label
              htmlFor="NoticeID"
              className="block text-sm font-medium text-gray-700"
            >
              Notice ID:
            </label>
            <input
              type="text"
              id="NoticeID"
              name="NoticeID"
              placeholder="Notice ID"
              value={newNotice.NoticeID}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4 col-span-2">
            <label
              htmlFor="Title"
              className="block text-sm font-medium text-gray-700"
            >
              Title:
            </label>
            <input
              type="text"
              id="Title"
              name="Title"
              placeholder="Notice Title"
              value={newNotice.Title}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4 col-span-2">
            <label
              htmlFor="Date"
              className="block text-sm font-medium text-gray-700"
            >
              Date:
            </label>
            <input
              type="date"
              id="Date"
              name="Date"
              value={newNotice.Date}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4 col-span-2">
            <label
              htmlFor="NoticeType"
              className="block text-sm font-medium text-gray-700"
            >
              Notice Type:
            </label>
            <select
              id="NoticeType"
              name="NoticeType"
              value={newNotice.NoticeType}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Notice Type</option>
              <option value="Promotion">Promotion</option>
              <option value="Opening Hours">Opening Hours</option>
              <option value="Scheduled Availability">
                Scheduled Availability
              </option>
            </select>
          </div>
          <div className="mb-4 col-span-2">
            <label
              htmlFor="Description"
              className="block text-sm font-medium text-gray-700"
            >
              Description:
            </label>
            <textarea
              id="Description"
              name="Description"
              placeholder="Notice Description"
              value={newNotice.Description}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={selectedNotice ? handleUpdateNotice : handleAddNotice}
          >
            {selectedNotice ? "Update Notice" : "Add Notice"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showConfirmationDialog}
        onClose={handleCancelDelete}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this notice?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="red" onClick={handleConfirmDelete}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={handleCancelDelete}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashNotice;
