import React, { useState, useEffect } from "react";
import { Modal, Button, Table } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiOutlineSearch, HiOutlineExclamationCircle } from "react-icons/hi";

const DashItemRequest = () => {
  const [itemRequests, setItemRequests] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItemRequest, setSelectedItemRequest] = useState(null);
  const [newItemRequest, setNewItemRequest] = useState({
    SupplierID: "",
    SupplierName: "",
    itemCode: "",
    itemName: "",
    Date: "",
    Quantity: "",
    Total: "",
  });
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchItemRequests();
  }, []);

  const fetchItemRequests = async () => {
    try {
      const response = await fetch("/api/itemRequest/all");
      if (!response.ok) {
        throw new Error(`Error fetching item requests: ${response.statusText}`);
      }
      const data = await response.json();
      setItemRequests(data.itemRequests.map((request) => ({ ...request })));
    } catch (error) {
      console.error("Error fetching item requests:", error);
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
    setSelectedItemRequest(null); // Reset selected item request when opening add modal
    setNewItemRequest({
      SupplierID: "",
      SupplierName: "",
      itemCode: "",
      itemName: "",
      Date: "",
      Quantity: "",
      Total: "",
    });
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
  };

  const handleAddItemRequest = async () => {
    try {
      const response = await fetch("/api/itemRequest/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItemRequest),
      });
      if (response.ok) {
        fetchItemRequests();
        handleAddModalClose();
        showToast("Item request added successfully!");
      } else {
        console.error("Failed to add item request");
      }
    } catch (error) {
      console.error("Error adding item request:", error);
    }
  };

  const handleUpdateModalOpen = (request) => {
    setSelectedItemRequest(request);
    setShowAddModal(true);
    setNewItemRequest(request); // Set newItemRequest state to the selected item request
  };

  const handleUpdateItemRequest = async () => {
    try {
      const response = await fetch(
        `/api/itemRequest/update/${selectedItemRequest._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newItemRequest),
        }
      );
      if (response.ok) {
        fetchItemRequests();
        handleAddModalClose();
        showToast("Item request updated successfully!");
      } else {
        console.error("Failed to update item request");
      }
    } catch (error) {
      console.error("Error updating item request:", error);
    }
  };

  const handleDeleteItemRequest = async (id) => {
    setSelectedItemRequest(id);
    setShowConfirmationDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`/api/itemRequest/${selectedItemRequest}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchItemRequests();
        setShowConfirmationDialog(false);
        showToast("Item request deleted successfully!");
      } else {
        console.error("Failed to delete item request");
      }
    } catch (error) {
      console.error("Error deleting item request:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmationDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItemRequest((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    // Filter item requests based on the search query
    const filteredItemRequests = itemRequests.filter((request) =>
      request.Date.includes(searchQuery)
    );
    setItemRequests(filteredItemRequests);
    setSearchQuery(""); // Clear search input field
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
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
          Add Item Request
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
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        All Item Requests
      </h2>

      {itemRequests && itemRequests.length > 0 ? (
        <Table className="w-auto table-auto">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-2">Supplier ID</th>
              <th className="px-4 py-2">Supplier Name</th>
              <th className="px-4 py-2">Item Code</th>
              <th className="px-4 py-2">Item Name</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ItemRequests.map((request) => (
              <tr key={request._id}>
                <td className="px-4 py-2">{request.SupplierID}</td>
                <td className="px-4 py-2">{request.SupplierName}</td>
                <td className="px-4 py-2">{request.itemCode}</td>
                <td className="px-4 py-2">{request.itemName}</td>
                <td className="px-4 py-2">{request.Date}</td>
                <td className="px-4 py-2">{request.Quantity}</td>
                <td className="px-4 py-2">{request.Total}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Button
                    color="green"
                    onClick={() => handleUpdateModalOpen(request)}
                  >
                    Update
                  </Button>
                  <Button
                    color="red"
                    onClick={() => handleDeleteItemRequest(request._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No item requests found</p>
      )}

      <Modal
        show={showAddModal}
        onClose={handleAddModalClose}
        popup
        size="lg"
      >
        <Modal.Header>
          {selectedItemRequest ? "Update Item Request" : "Add Item Request"}
        </Modal.Header>
        <Modal.Body className="grid grid-cols-2 gap-2">
          {/* Input fields for SupplierID, SupplierName, itemCode, itemName, Date, Quantity, and Total */}
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={selectedItemRequest ? handleUpdateItemRequest : handleAddItemRequest}
          >
            {selectedItemRequest ? "Update Item Request" : "Add Item Request"}
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
              Are you sure you want to delete this item request?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="red"
                onClick={handleConfirmDelete}
              >
                Yes, I'm sure
              </Button>
              <Button
                color="gray"
                onClick={handleCancelDelete}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashItemRequest;
