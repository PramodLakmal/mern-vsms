import React, { useState, useEffect } from "react";
import { Button, FloatingLabel, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";

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
    let totalAmount = 0;

    // Calculate total amount for selected items
    Object.keys(selectedItems).forEach((itemId) => {
      const item = items.find((item) => item._id === itemId);
      totalAmount += item.price * selectedItems[itemId];
    });

    // Calculate total amount for selected services
    selectedServices.forEach((service) => {
      totalAmount += service.price;
    });

    // Apply coupon if it's applied
    if (appliedCoupon) {
      if (appliedCoupon.discountType === "percentage") {
        totalAmount -= (totalAmount * appliedCoupon.discountAmount) / 100;
      } else {
        totalAmount -= appliedCoupon.discountAmount;
      }
    }

    return totalAmount;
  };

  const handleSaveAndPrint = async () => {
  
    try {
      const transactionData = {
        userId: selectedUser ? selectedUser._id : null,
        customerName: manualDbName,
        customerMobile: manualDbMobile,
        selectedItems: Object.keys(selectedItems).map(itemId => ({ itemId, quantity: selectedItems[itemId] })),
        selectedServices: selectedServices.map(service => ({ serviceId: service._id })),
        totalAmount: calculateTotalAmount()
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
        // Handle printing logic here...
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

      {/* Bill modal */}
      <Modal
        show={showBillModal}
        onClose={() => setShowBillModal(false)}
        popup
        size="lg"
      >
        <Modal.Header>
          <h2>Bill Details</h2>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <h3>User Details:</h3>
              <p>Name: {selectedUser.username}</p>
              <p>Mobile: {selectedUser.phoneNumber}</p>
            </div>
          )}

          {Object.keys(selectedItems).length > 0 && (
            <div>
              <h3>Selected Items:</h3>
              <ul>
                {Object.keys(selectedItems).map((itemId) => {
                  const selectedItem = items.find(
                    (item) => item._id === itemId
                  );
                  return (
                    <li key={itemId}>
                      {selectedItem.name} - Quantity: {selectedItems[itemId]}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {selectedServices.length > 0 && (
            <div>
              <h3>Selected Services:</h3>
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
            <div>
              <h3>Coupon Applied:</h3>
              <p>Code: {appliedCoupon.code}</p>
              {/* Display any other coupon details */}
            </div>
          )}

          <h3>Total Amount: {calculateTotalAmount()}</h3>

          {/* Print button */}
          <Button gradientDuoTone="purpleToBlue" onClick={handleSaveAndPrint}>
            Save and Print
          </Button>
        </Modal.Body>
      </Modal>

      <h1>Cart</h1>

      {selectedUser && (
        <div>
          <h3>Name : {selectedUser.username}</h3>
          <p>Mobile: {selectedUser.phoneNumber}</p>
          <Button onClick={handleRemoveUser}>Remove</Button>
        </div>
      )}
      <h2>Items: </h2>
      <ul>
        {Object.keys(selectedItems).map((itemId) => {
          const item = items.find((item) => item._id === itemId);
          if (selectedItems[itemId] > 0) {
            return (
              <li key={itemId}>
                {item.name} - Quantity: {selectedItems[itemId]}
                <Button onClick={() => handleSelectItem(item)}>Add</Button>
                <Button onClick={() => handleRemoveItem(itemId)}>Remove</Button>
                <Button onClick={() => handleDeleteItem(itemId)}>Delete</Button>
              </li>
            );
          }
          return null;
        })}
      </ul>
      <h2>Services: </h2>
      <ul>
        {selectedServices.map((service) => (
          <li key={service._id}>
            {service.name} - {service.description} - Price: {service.price}
            <Button onClick={() => handleRemoveService(service._id)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>

      <input
        type="text"
        placeholder="Enter coupon code"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
      />
      <Button
        gradientDuoTone="purpleToBlue"
        outline
        onClick={handleApplyCoupon}
      >
        Apply
      </Button>
      <Button
        gradientDuoTone="purpleToBlue"
        outline
        onClick={handleRemoveCoupon}
      >
        Remove Coupon
      </Button>

      {invalidCouponMessage && <p>{invalidCouponMessage}</p>}

      {appliedCoupon && (
        <div>
          <p>Coupon Applied: {appliedCoupon.code}</p>
          {/* Display any other coupon details you want */}
        </div>
      )}

      <p>Total Amount: {calculateTotalAmount()}</p>

      {/* Checkout button */}
      <Button gradientDuoTone="purpleToBlue" onClick={handleCheckout}>
        Checkout
      </Button>
    </div>
  );
}
