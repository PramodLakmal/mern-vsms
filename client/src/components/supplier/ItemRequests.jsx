import React, { useState } from "react";
import { Modal, Button, Table } from "flowbite-react"; // Import necessary components

const ItemRequestForm = () => {
  // State variables for form inputs, form visibility, and item requests
  const [itemName, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemTotalPrice, setItemTotalPrice] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [itemRequests, setItemRequests] = useState([]);
  const [updateIndex, setUpdateIndex] = useState(null); // State to track index of item being updated

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Handle form submission here
      console.log("Form submitted!");
      if (updateIndex !== null) {
        // If updateIndex is not null, it means an item is being updated
        updateItemRequest(updateIndex, {
          itemName,
          itemCode,
          itemQuantity,
          itemTotalPrice,
        });
        setUpdateIndex(null); // Reset updateIndex after updating
      } else {
        // Otherwise, add a new item request
        addItemRequestToList();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Function to add item request to the list
  const addItemRequestToList = () => {
    const newItemRequest = {
      itemName,
      itemCode,
      itemQuantity,
      itemTotalPrice,
    };
    setItemRequests([...itemRequests, newItemRequest]);
    // Reset form inputs
    setItemName("");
    setItemCode("");
    setItemQuantity("");
    setItemTotalPrice("");
    // Close the form
    setShowForm(false);
  };

  // Function to delete an item request
  const deleteItemRequest = (index) => {
    const updatedRequests = [...itemRequests];
    updatedRequests.splice(index, 1);
    setItemRequests(updatedRequests);
  };

  // Function to update an item request
  const updateItemRequest = (index, updatedRequest) => {
    const updatedRequests = [...itemRequests];
    updatedRequests[index] = updatedRequest;
    setItemRequests(updatedRequests);
  };

  // Function to handle update button click
  const handleUpdateClick = (index, request) => {
    setUpdateIndex(index); // Set the index of the item being updated
    setItemName(request.itemName);
    setItemCode(request.itemCode);
    setItemQuantity(request.itemQuantity);
    setItemTotalPrice(request.itemTotalPrice);
    setShowForm(true); // Show the form for updating item details
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f7f7f7", }}>
      <Button onClick={() => setShowForm(!showForm)}>Add Item</Button>
      <Modal show={showForm} onClose={() => setShowForm(false)} popup size="md">
        <Modal.Header>{updateIndex !== null ? "Update Item" : "Add Item Request"}</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "10px" }}>
              <label htmlFor="itemName">Item Name:</label>
              <input
                type="text"
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label htmlFor="itemCode">Item Code:</label>
              <input
                type="text"
                id="itemCode"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label htmlFor="itemQuantity">Item Quantity:</label>
              <input
                type="number"
                id="itemQuantity"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label htmlFor="itemTotalPrice">Item Total Price:</label>
              <input
                type="number"
                id="itemTotalPrice"
                value={itemTotalPrice}
                onChange={(e) => setItemTotalPrice(e.target.value)}
              />
            </div>
            <Button type="submit">{updateIndex !== null ? "Update Item" : "Add Item Request"}</Button>
          </form>
        </Modal.Body>
      </Modal>

      {itemRequests.length > 0 && (
        <Table className="table-fixed" style={{ border: "1px solid #ccc", marginTop: "20px" }}>
          <thead>
            <tr>
              <th className="text-left" style={{ padding: "10px" }}>Item Name</th>
              <th className="text-left" style={{ padding: "10px" }}>Item Code</th>
              <th className="text-left" style={{ padding: "10px" }}>Item Quantity</th>
              <th className="text-left" style={{ padding: "10px" }}>Item Total Price</th>
              <th className="text-left" style={{ padding: "10px" }}>Actions</th> {/* Column for update and delete buttons */}
            </tr>
          </thead>
          <tbody>
            {itemRequests.map((request, index) => (
              <tr key={index}>
                <td style={{ padding: "10px" }}>{request.itemName}</td>
                <td style={{ padding: "10px" }}>{request.itemCode}</td>
                <td style={{ padding: "10px" }}>{request.itemQuantity}</td>
                <td style={{ padding: "10px" }}>{request.itemTotalPrice}</td>
                <td style={{ padding: "10px", display: "flex", justifyContent: "space-around" }}>
                  {/* Update and delete buttons */}
                  <Button onClick={() => deleteItemRequest(index)}>Delete</Button>
                  <Button onClick={() => handleUpdateClick(index, request)}>Update</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ItemRequestForm;
