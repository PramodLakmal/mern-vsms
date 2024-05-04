import React, { useState, useEffect } from "react";
import { Button, FloatingLabel, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FaTrash, FaPlus, FaMinus, FaTrashAlt } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DashCart() {
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualMobile, setManualMobile] = useState("");
  const [showItemModal, setShowItemModal] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [services, setServices] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [invalidCouponMessage, setInvalidCouponMessage] = useState("");
  const [showBillModal, setShowBillModal] = useState(false);
  const [manualDbName, setManualDbName] = useState("");
  const [manualDbMobile, setManualDbMobile] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();

    const fetchItems = async () => {
      try {
        const res = await fetch(`/api/items`);
        const data = await res.json();
        if (res.ok) {
          setItems(data.items);
        } else {
          console.error("Failed to fetch items:", data.message);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();

    const fetchServices = async () => {
      try {
        const res = await fetch(`/api/service/all`);
        const data = await res.json();
        if (res.ok) {
          setServices(data.services);
        } else {
          console.error("Failed to fetch services:", data.message);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowUserModal(false);
    setManualName("");
    setManualMobile("");
    setManualDbName(null);
    setManualDbMobile(null);
  };

  const handleRemoveUser = () => {
    setSelectedUser(null);
  };

  const handleServiceSelect = (service) => {
    setSelectedServices([...selectedServices, service]);
    setShowServiceModal(false);
  };

  const handleAddManualCustomer = () => {
    setSelectedUser({
      username: manualName,
      phoneNumber: manualMobile,
    });
    setManualDbMobile(manualMobile);
    setManualDbName(manualName);
    setManualName("");
    setManualMobile("");
  };

  const handleSelectItem = (item) => {
    if (selectedItems[item._id]) {
      setSelectedItems({
        ...selectedItems,
        [item._id]: selectedItems[item._id] + 1,
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        [item._id]: 1,
      });
    }
  };

  const handleRemoveItem = (itemId) => {
    if (selectedItems[itemId] > 0) {
      setSelectedItems({
        ...selectedItems,
        [itemId]: selectedItems[itemId] - 1,
      });
    }
  };

  const handleDeleteItem = (itemId) => {
    const updatedSelectedItems = { ...selectedItems };
    delete updatedSelectedItems[itemId];
    setSelectedItems(updatedSelectedItems);
  };

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity === "0") {
      setSelectedItems({
        ...selectedItems,
        [itemId]: 0,
      });
    } else {
      const parsedQuantity = parseInt(quantity, 10);
      if (!isNaN(parsedQuantity) && parsedQuantity >= 0) {
        setSelectedItems({
          ...selectedItems,
          [itemId]: parsedQuantity,
        });
      }
    }
  };

  const handleRemoveService = (serviceId) => {
    const updatedSelectedServices = selectedServices.filter(
      (service) => service._id !== serviceId
    );
    setSelectedServices(updatedSelectedServices);
  };

  const handleApplyCoupon = async () => {
    try {
      const res = await fetch("/api/coupon/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ couponCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedCoupon(data.coupon);
        setInvalidCouponMessage("");
        console.log("Coupon applied:", data.coupon);
      } else {
        setInvalidCouponMessage(data.message);
        console.error("Failed to apply coupon:", data.message);
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setInvalidCouponMessage("");
  };

  const calculateTotalAmount = () => {
    let totalAmountWithoutDiscounts = 0;
    let totalAmount = 0;
    let discountAmount = 0;

    // Calculate total amount for selected items
    Object.keys(selectedItems).forEach((itemId) => {
      const item = items.find((item) => item._id === itemId);
      totalAmountWithoutDiscounts += item.price * selectedItems[itemId];
      totalAmount += item.price * selectedItems[itemId];
    });

    // Calculate total amount for selected services
    selectedServices.forEach((service) => {
      totalAmountWithoutDiscounts += service.price;
      totalAmount += service.price;
    });

    // Apply coupon if it's applied
    if (appliedCoupon) {
      if (appliedCoupon.discountType === "percentage") {
        discountAmount = (totalAmount * appliedCoupon.discountAmount) / 100;
        totalAmount -= discountAmount;
      } else {
        discountAmount = appliedCoupon.discountAmount;
        totalAmount -= appliedCoupon.discountAmount;
      }
    }

    return {
      totalAmountWithoutDiscounts,
      discountAmount,
      finalAmount: totalAmount,
    };
  };

  const handleSaveAndPrint = async () => {
    try {
      const transactionData = {
        userId: selectedUser ? selectedUser._id : null,
        customerName: manualDbName,
        customerMobile: manualDbMobile,
        selectedItems: Object.keys(selectedItems).map((itemId) => ({
          itemId,
          quantity: selectedItems[itemId],
        })),
        selectedServices: selectedServices.map((service) => ({
          serviceId: service._id,
        })),
        totalAmount: calculateTotalAmount().finalAmount.toFixed(2),
      };
      const res = await fetch("/api/transactions/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("Transaction saved:", data.transaction);

        // Create a new instance of jsPDF
        const doc = new jsPDF();

        // Set font and font size for the entire document
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);

        // Add header
        doc.text("Bill Details", 50, 20, null, null, "center");
        doc.line(10, 25, 200, 25); // horizontal line

        let y = 30; // Initialize y here

        // User Details
        if (selectedUser) {
          doc.text("User Details:", 15, y);
          y += 5;
          doc.text(`Name: ${selectedUser.username}`, 20, y);
          y += 5;
          doc.text(`Mobile: ${selectedUser.phoneNumber}`, 20, y);
          y += 10;
        }

        // Selected Items
        if (Object.keys(selectedItems).length > 0) {
          doc.text("Selected Items:", 15, y);
          y += 5;
          Object.keys(selectedItems).forEach((itemId, index) => {
            const selectedItem = items.find((item) => item._id === itemId);
            doc.text(
              `${index + 1}. ${selectedItem.name} - Quantity: ${
                selectedItems[itemId]
              }`,
              20,
              y
            );
            y += 5;
          });
          y += 10;
        }

        // Selected Services
        if (selectedServices.length > 0) {
          doc.text("Selected Services:", 15, y);
          y += 5;
          selectedServices.forEach((service, index) => {
            doc.text(
              `${index + 1}. ${service.name} - Price: ${service.price}`,
              20,
              y
            );
            y += 5;
          });
          y += 10;
        }

        // Total Amount
        doc.text("Total Amount:", 15, y);
        doc.text(
          `$${calculateTotalAmount().finalAmount.toFixed(2)}`,
          150,
          y,
          null,
          null,
          "right"
        );
        y += 10;

        // Draw border around the bill details
        doc.setLineWidth(0.5);
        doc.rect(10, 10, doc.internal.pageSize.getWidth() - 20, y + 10);

        // Save the PDF
        doc.save("bill.pdf");
      } else {
        console.error("Failed to save transaction:", data.message);
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckout = () => {
    setShowBillModal(true);
  };

  return (
    <div className="flex">
      {/* Left Section */}
      <div className="flex-1">
        <div className="">
          <Link to="#">
            <Button
              gradientDuoTone="purpleToBlue"
              outline
              onClick={() => setShowUserModal(true)}
            >
              Select Customer
            </Button>
          </Link>
          <div className="grid justify-stretch">
            <FloatingLabel
              variant="outlined"
              label="Name"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
            />
            <FloatingLabel
              variant="outlined"
              label="Mobile Number"
              value={manualMobile}
              onChange={(e) => setManualMobile(e.target.value)}
            />
            <Button
              gradientDuoTone="purpleToBlue"
              outline
              onClick={handleAddManualCustomer}
            >
              Add Customer
            </Button>
            <Button
              gradientDuoTone="purpleToBlue"
              outline
              onClick={() => setShowItemModal(true)}
            >
              Select Item
            </Button>
          </div>
          <Button
            gradientDuoTone="purpleToBlue"
            outline
            onClick={() => setShowServiceModal(true)}
          >
            Select Service
          </Button>

          <Modal
            show={showUserModal}
            onClose={() => setShowUserModal(false)}
            popup
            size="lg"
          >
            <Modal.Header>
              <input
                type="text"
                placeholder="Search users..."
                className="border p-2 rounded w-full mb-4"
                value={searchQuery}
                onChange={handleSearch}
              />
            </Modal.Header>
            <Modal.Body>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Username</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {filteredUsers.map((user) => (
                    <Table.Row
                      key={user._id}
                      onClick={() => handleUserSelect(user)}
                      className="cursor-pointer"
                    >
                      <Table.Cell>{user.username}</Table.Cell>
                      <Table.Cell>{user.email}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Modal.Body>
          </Modal>

          <Modal
            show={showItemModal}
            onClose={() => setShowItemModal(false)}
            popup
            size="lg"
          >
            <Modal.Header></Modal.Header>
            <Modal.Body>
              <input
                type="text"
                placeholder="Search items..."
                className="border p-2 rounded w-full mb-4"
                value={searchQuery}
                onChange={handleSearch}
              />
              {filteredItems && filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div key={item._id} className="cursor-pointer">
                    <img
                      src={item.picture}
                      alt={item.name}
                      style={{ width: "100px", height: "100px" }}
                    />
                    <p>{item.name}</p>
                    <input
                      type="number"
                      min="0"
                      value={selectedItems[item._id] || 0}
                      onChange={(e) =>
                        handleQuantityChange(item._id, e.target.value)
                      }
                    />
                    <Button onClick={() => handleSelectItem(item)}>Add</Button>
                    <Button onClick={() => handleRemoveItem(item._id)}>
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <p>No items available</p>
              )}
            </Modal.Body>
          </Modal>

          <Modal
            show={showServiceModal}
            onClose={() => setShowServiceModal(false)}
            popup
            size="lg"
          >
            <Modal.Header></Modal.Header>
            <Modal.Body>
              <input
                type="text"
                placeholder="Search services..."
                className="border p-2 rounded w-full mb-4"
                value={searchQuery}
                onChange={handleSearch}
              />
              {filteredServices && filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <div key={service._id} className="cursor-pointer">
                    <img
                      src={service.image}
                      alt={service.name}
                      style={{ width: "100px", height: "100px" }}
                    />
                    <p>{service.name}</p>
                    <p>{service.description}</p>
                    <p>Price: {service.price}</p>
                    <Button onClick={() => handleServiceSelect(service)}>
                      Select
                    </Button>
                  </div>
                ))
              ) : (
                <p>No services available</p>
              )}
            </Modal.Body>
          </Modal>

          <Modal
            show={showBillModal}
            onClose={() => setShowBillModal(false)}
            popup
            size="lg"
          >
            <Modal.Header>
              <h2 className="text-xl font-bold">Bill Details</h2>
            </Modal.Header>
            <Modal.Body>
              {selectedUser && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">User Details:</h3>
                  <p className="mb-1">Name: {selectedUser.username}</p>
                  <p className="mb-1">Mobile: {selectedUser.phoneNumber}</p>
                </div>
              )}

              {Object.keys(selectedItems).length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Selected Items:
                  </h3>
                  <ul>
                    {Object.keys(selectedItems).map((itemId) => {
                      const selectedItem = items.find(
                        (item) => item._id === itemId
                      );
                      return (
                        <li key={itemId}>
                          {selectedItem.name} - Quantity:{" "}
                          {selectedItems[itemId]}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {selectedServices.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Selected Services:
                  </h3>
                  <ul>
                    {selectedServices.map((service) => (
                      <li key={service._id}>
                        {service.name} - Price: {service.price}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {appliedCoupon && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Coupon Applied:
                  </h3>
                  <p className="mb-1">Code: {appliedCoupon.code}</p>
                  {/* Display any other coupon details */}
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-2">Total Amount</h3>
                <p className="mb-1">
                  Total Amount without Discounts: $
                  {calculateTotalAmount().totalAmountWithoutDiscounts.toFixed(
                    2
                  )}
                </p>
                <p className="mb-1">
                  Discount Amount: $
                  {calculateTotalAmount().discountAmount.toFixed(2)}
                </p>
                <p className="mb-1">
                  <span className="text-xl font-bold text-purple-600">
                    Final Amount: $
                    {calculateTotalAmount().finalAmount.toFixed(2)}
                  </span>
                </p>
              </div>

              {/* Print button */}
              <Button
                className="mt-4"
                gradientDuoTone="purpleToBlue"
                onClick={handleSaveAndPrint}
              >
                Save and Print
              </Button>
            </Modal.Body>
          </Modal>
        </div>
      </div>

      {/* Right Section (Cart) */}
      <div className="flex-1 ml-10">
        <h1>Customer:</h1>

        {/* User details */}
        {selectedUser && (
          <div className="rounded-lg overflow-hidden shadow-md bg-white flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <p className="font-semibold mr-4">
                Name: {selectedUser.username}
              </p>
              <p className="text-gray-700">
                Mobile: {selectedUser.phoneNumber}
              </p>
            </div>
            <button
              onClick={handleRemoveUser}
              className="flex items-center text-red-600 hover:text-red-800"
            >
              <FaTrash className="mr-1" /> Remove
            </button>
          </div>
        )}

        {/* Display selected items */}
        <div className="mt-4">
          <h2>Items: </h2>
          <div className="rounded-lg overflow-hidden shadow-md bg-white p-4">
            <ul>
              {Object.keys(selectedItems).map((itemId) => {
                const item = items.find((item) => item._id === itemId);
                if (selectedItems[itemId] > 0) {
                  const totalPrice = selectedItems[itemId] * item.price;
                  return (
                    <li
                      key={itemId}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <p className="mr-4">{item.name}</p>
                        <p className="mr-4">Qty: {selectedItems[itemId]}</p>
                        <p className="mr-4">Price: ${item.price}</p>
                        <p>Total: ${totalPrice}</p>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleSelectItem(item)}
                          className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          <FaPlus />
                        </button>
                        <button
                          onClick={() => handleRemoveItem(itemId)}
                          className="mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          <FaMinus />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(itemId)}
                          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>
        </div>
        {/* Services */}
        <div className="mt-4">
          <h2>Services: </h2>
          <div className="rounded-lg overflow-hidden shadow-md bg-white p-4">
            <ul>
              {selectedServices.map((service) => (
                <li
                  key={service._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <p className="mr-4">{service.name} </p>
                    <p>Price: ${service.price}</p>
                  </div>
                  <div>
                    <Button onClick={() => handleRemoveService(service._id)}>
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Coupon Section */}
        <div className="mt-4 flex items-center">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 mr-2"
          />
          <Button
            gradientDuoTone="purpleToBlue"
            outline
            onClick={handleApplyCoupon}
            className="mr-2"
          >
            Apply
          </Button>
          {invalidCouponMessage && (
            <p className="text-red-500">{invalidCouponMessage}</p>
          )}
          {appliedCoupon && (
            <div className="flex items-center">
              <p className="mr-2">Coupon Applied: {appliedCoupon.code}</p>
              {/* Display any other coupon details you want */}
              <button
                onClick={handleRemoveCoupon}
                className="text-red-600 hover:text-red-800"
              >
                <FaTrashAlt />
              </button>
            </div>
          )}
        </div>

        <div className="bg-gray-100 rounded-lg shadow-md p-6 max-w-md mx-auto">
          <div className="mb-6">
            <p className="text-lg font-bold mb-2">Total Amount</p>
            <p className="mb-1">
              Total Amount: $
              {calculateTotalAmount().totalAmountWithoutDiscounts.toFixed(2)}
            </p>
            <p className="mb-1">
              Discount Amount: $
              {calculateTotalAmount().discountAmount.toFixed(2)}
            </p>
            <p className="mb-1">
              Final Amount: ${calculateTotalAmount().finalAmount.toFixed(2)}
            </p>
          </div>

          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-md text-lg font-semibold w-full transition duration-300 ease-in-out hover:bg-purple-700"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
