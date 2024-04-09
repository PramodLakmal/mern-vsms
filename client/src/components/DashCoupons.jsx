import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Toast } from "flowbite-react";
import { HiOutlineExclamationCircle, HiCheck, HiX } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percentage",
    discountAmount: 0,
    expiryDate: "",
    usageLimit: "",
    isActive: true,
  });
  const [updatedCoupon, setUpdatedCoupon] = useState({
    code: "",
    discountType: "percentage",
    discountAmount: 0,
    expiryDate: "",
    usageLimit: null,
    isActive: true,
  });
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch("/api/coupon/all");
      if (!response.ok) {
        throw new Error(`Error fetching coupons: ${response.statusText}`);
      }
      const data = await response.json();
      setCoupons(
        data.coupons.map((coupon) => {
          checkIfCouponIsExpired(coupon);
          return {
            ...coupon,
            expiryDate: coupon.expiryDate
              ? new Date(coupon.expiryDate).toLocaleDateString()
              : "",
          };
        })
      );
    } catch (error) {
      console.error("Error fetching coupons:", error);
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
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
    setNewCoupon({
      code: "",
      discountType: "percentage",
      discountAmount: "",
      expiryDate: "",
      usageLimit: null,
      isActive: true,
    });
  };

  const checkIfCouponIsExpired = (coupon) => {
    const expiryDate = new Date(coupon.expiryDate);
    if (expiryDate < new Date()) {
      // The coupon is expired, so update its status in the database
      fetch(`/api/coupon/update/${coupon._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...coupon, isActive: false }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Update the coupon in the state
          setCoupons(
            coupons.map((c) =>
              c._id === coupon._id ? { ...c, isActive: false } : c
            )
          );
        })
        .catch((error) => {
          console.error("Error updating coupon:", error);
        });
    }
  };

  const handleAddCoupon = async () => {
    try {
      const response = await fetch("/api/coupon/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCoupon),
      });
      if (response.ok) {
        fetchCoupons();
        handleAddModalClose();
        showToast("Coupon added successfully!");
      } else {
        console.error("Failed to add coupon");
      }
    } catch (error) {
      console.error("Error adding coupon:", error);
    }
  };

  const handleUpdateModalOpen = (coupon) => {
    setSelectedCoupon(coupon);
    const expiryDate = new Date(coupon.expiryDate);
    expiryDate.setDate(expiryDate.getDate() + 1);
    setUpdatedCoupon({
      ...coupon,
      expiryDate: expiryDate.toISOString().split("T")[0],
    });
    setShowUpdateModal(true);
  };

  const handleUpdateModalClose = () => {
    setShowUpdateModal(false);
  };

  const handleUpdateCoupon = async () => {
    try {
      const response = await fetch(`/api/coupon/update/${selectedCoupon._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCoupon),
      });
      if (response.ok) {
        fetchCoupons();
        setShowUpdateModal(false);
        showToast("Coupon updated successfully!");
      } else {
        console.error("Failed to update coupon");
      }
    } catch (error) {
      console.error("Error updating coupon:", error);
    }
  };

  const handleDeleteCoupon = async (id) => {
    setCouponToDelete(id);
    setShowConfirmationDialog(true);
  };

  const confirmDeleteCoupon = async () => {
    try {
      const response = await fetch(`/api/coupon/${couponToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchCoupons();
        setShowConfirmationDialog(false);
        showToast("Coupon deleted successfully!");
      } else {
        console.error("Failed to delete coupon");
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  const handleConfirmationDialogClose = () => {
    setShowConfirmationDialog(false);
    setCouponToDelete(null);
  };

  const handleInputChange = (e, target = "new") => {
    const { name, value, type, checked } = e.target;
    if (name === "discountAmount") {
      const newValue = Math.max(0, parseFloat(value));
      if (target === "new") {
        setNewCoupon((prevState) => ({
          ...prevState,
          [name]: type === "checkbox" ? checked : newValue,
        }));
      } else {
        setUpdatedCoupon((prevState) => ({
          ...prevState,
          [name]: type === "checkbox" ? checked : newValue,
        }));
      }
    } else {
      if (target === "new") {
        setNewCoupon((prevState) => ({
          ...prevState,
          [name]: type === "checkbox" ? checked : value,
        }));
      } else {
        setUpdatedCoupon((prevState) => ({
          ...prevState,
          [name]: type === "checkbox" ? checked : value,
        }));
      }
    }
  };

  return (
    <div className="container mx-auto p-4 relative">
      <ToastContainer />

      <Button
        onClick={handleAddModalOpen}
        className="mb-4 bg-blue-500 text-white hover:bg-blue-700"
      >
        Add Coupon
      </Button>

      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        All Coupons
      </h2>

      {coupons && coupons.length > 0 ? (
        <Table className="w-full table-auto">
          <thead>
            <tr className="text-left text-gray-600 dark:text-gray-400">
              <th>Code</th>
              <th>Discount Type</th>
              <th>Discount Amount</th>
              <th>Expiry Date</th>
              <th>Usage Limit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr
                key={coupon._id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td>{coupon.code}</td>
                <td>{coupon.discountType}</td>
                <td>{coupon.discountAmount}</td>
                <td>{coupon.expiryDate}</td>
                <td>{coupon.usageLimit}</td>
                <td>
                  <div
                    className={`inline-flex h-6 px-2 rounded-lg ${
                      coupon.isActive ? "bg-green-200" : "bg-red-200"
                    } text-xs font-medium items-center text-black`}
                  >
                    {coupon.isActive ? (
                      <HiCheck className="h-4 w-4 text-green-600" />
                    ) : (
                      <HiX className="h-4 w-4 text-red-600" />
                    )}
                    {coupon.isActive ? "Active" : "Inactive"}
                  </div>
                </td>
                <td>
                  <div className="flex flex-row">
                    <Button
                      onClick={() => handleUpdateModalOpen(coupon)}
                      className="mr-2 bg-blue-500 text-white hover:bg-blue-700"
                    >
                      Update
                    </Button>
                    <Button
                      onClick={() => handleDeleteCoupon(coupon._id)}
                      className="bg-red-500 text-white hover:bg-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No coupons found</p>
      )}
      <Modal
        show={showConfirmationDialog}
        onClose={handleConfirmationDialogClose}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this coupon?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={confirmDeleteCoupon}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={handleConfirmationDialogClose}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showAddModal} onClose={handleAddModalClose} popup size="lg">
        <Modal.Header>Add Coupon</Modal.Header>
        <Modal.Body className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              Coupon Code:
            </label>
            <input
              type="text"
              id="code"
              name="code"
              placeholder="Coupon Code"
              value={newCoupon.code}
              onChange={(e) => handleInputChange(e, "new")}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="discountType"
              className="block text-sm font-medium text-gray-700"
            >
              Discount Type:
            </label>
            <select
              id="discountType"
              name="discountType"
              value={newCoupon.discountType}
              onChange={(e) => handleInputChange(e, "new")}
              className="border p-2 rounded w-full"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
          <div className="mb-4 col-span-2">
            <label
              htmlFor="discountAmount"
              className="block text-sm font-medium text-gray-700"
            >
              Discount Amount:
            </label>
            <input
              type="number"
              id="discountAmount"
              name="discountAmount"
              placeholder="Discount Amount"
              value={newCoupon.discountAmount}
              onChange={(e) => handleInputChange(e, "new")}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-gray-700"
            >
              Expiry Date:
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={newCoupon.expiryDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => handleInputChange(e, "new")}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="usageLimit"
              className="block text-sm font-medium text-gray-700"
            >
              Usage Limit:
            </label>
            <input
              type="number"
              id="usageLimit"
              name="usageLimit"
              placeholder="Usage Limit"
              value={newCoupon.usageLimit}
              min={0}
              onChange={(e) => handleInputChange(e, "new")}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="isActive" className="inline-flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={newCoupon.isActive}
                onChange={(e) => handleInputChange(e, "new")}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
              <span className="ml-2 text-gray-700">Active</span>
            </label>
          </div>
          <div className="col-span-2">
            <Button onClick={handleAddCoupon} className="mt-4 w-full">
              Add
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showUpdateModal}
        onClose={handleUpdateModalClose}
        popup
        size="lg"
      >
        <Modal.Header>Update Coupon</Modal.Header>
        <Modal.Body className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              htmlFor="update-code"
              className="block text-sm font-medium text-gray-700"
            >
              Coupon Code:
            </label>
            <input
              type="text"
              id="update-code"
              name="code"
              placeholder="Coupon Code"
              value={updatedCoupon.code}
              onChange={(e) => handleInputChange(e, "update")}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="update-discountType"
              className="block text-sm font-medium text-gray-700"
            >
              Discount Type:
            </label>
            <select
              id="update-discountType"
              name="discountType"
              value={updatedCoupon.discountType}
              onChange={(e) => handleInputChange(e, "update")}
              className="border p-2 rounded w-full"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
          <div className="mb-4 col-span-2">
            <label
              htmlFor="update-discountAmount"
              className="block text-sm font-medium text-gray-700"
            >
              Discount Amount:
            </label>
            <input
              type="number"
              id="update-discountAmount"
              name="discountAmount"
              placeholder="Discount Amount"
              value={updatedCoupon.discountAmount}
              onChange={(e) => handleInputChange(e, "update")}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="update-expiryDate"
              className="block text-sm font-medium text-gray-700"
            >
              Expiry Date:
            </label>
            <input
              type="date"
              id="update-expiryDate"
              name="expiryDate"
              value={updatedCoupon.expiryDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => handleInputChange(e, "update")}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="update-usageLimit"
              className="block text-sm font-medium text-gray-700"
            >
              Usage Limit:
            </label>
            <input
              type="number"
              id="update-usageLimit"
              name="usageLimit"
              placeholder="Usage Limit"
              value={updatedCoupon.usageLimit}
              min={0}
              onChange={(e) => handleInputChange(e, "update")}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="update-isActive"
              className="inline-flex items-center"
            >
              <input
                type="checkbox"
                id="update-isActive"
                name="isActive"
                checked={updatedCoupon.isActive}
                onChange={(e) => handleInputChange(e, "update")}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
              <span className="ml-2 text-gray-700">Active</span>
            </label>
          </div>
          <div className="col-span-2">
            <Button onClick={handleUpdateCoupon} className="mt-4 w-full">
              Update
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashCoupons;
