import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiCheck, HiX, HiMinus } from "react-icons/hi";
import { BsCheckCircle } from "react-icons/bs";
import { BiDollar } from "react-icons/bi";


export default function DashAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [searchUsername, setSearchUsername] = useState("");
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [actionType, setActionType] = useState("");
  const [appointmentToConfirm, setAppointmentToConfirm] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointment/cashier");
      const data = await res.json();
      if (res.ok) {
        setAppointments(data.appointments);
      } else {
        console.error("Failed to fetch appointments:", data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleMarkCompleted = async (appointmentId) => {
    setActionType("markCompleted");
    setAppointmentToConfirm(appointmentId);
    setShowConfirmationDialog(true);
  };

  const handleCancelAppointment = async (appointmentId) => {
    setActionType("cancelAppointment");
    setAppointmentToConfirm(appointmentId);
    setShowConfirmationDialog(true);
  };

  const handleIssueRefund = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    const selectedAppointment = appointments.find(
      (appointment) => appointment._id === appointmentId
    );
    if (selectedAppointment) {
      setRefundAmount(selectedAppointment.amount);
    }
    setShowRefundModal(true);
  };

  const handleSubmitRefund = async () => {
    try {
      const res = await fetch(
        `/api/refunds/${selectedAppointmentId}/issueRefund`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refundedAmount: refundAmount }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        console.log("Refund issued successfully:", data.refund);
        toast.success("Refund issued successfully");
        const updatedAppointments = appointments.map((appointment) => {
          if (appointment._id === selectedAppointmentId) {
            return {
              ...appointment,
              refunded: true,
            };
          }
          return appointment;
        });
        setAppointments(updatedAppointments);
        setShowRefundModal(false);
        setRefundAmount(0);
      } else {
        console.error("Failed to issue refund:", data.message);
        toast.error("Failed to issue refund");
      }
    } catch (error) {
      console.error("Error issuing refund:", error);
      toast.error("Error issuing refund");
    }
  };

  const handleConfirmationDialogClose = () => {
    setShowConfirmationDialog(false);
    setActionType("");
    setAppointmentToConfirm(null);
  };

  const handleConfirmAction = async () => {
    if (actionType === "markCompleted") {
      await handleMarkCompletedConfirmed(appointmentToConfirm);
    } else if (actionType === "cancelAppointment") {
      await handleCancelAppointmentConfirmed(appointmentToConfirm);
    }
    handleConfirmationDialogClose();
  };

  const handleMarkCompletedConfirmed = async (appointmentId) => {
    try {
      const res = await fetch(
        `/api/appointment/cashier/${appointmentId}/markCompleted`,
        { method: "PUT" }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Marked as completed");
        fetchAppointments();
      } else {
        console.error("Failed to mark appointment as completed:", data.message);
        toast.error("Failed to mark appointment as completed");
      }
    } catch (error) {
      console.error("Error marking appointment as completed:", error);
      toast.error("Error marking appointment as completed");
    }
  };

  const handleCancelAppointmentConfirmed = async (appointmentId) => {
    try {
      const res = await fetch(
        `/api/appointment/cashier/${appointmentId}/cancel`,
        { method: "PUT" }
      );
      const data = await res.json();
      if (res.ok) {
        console.log("Appointment cancelled:", data.appointment);
        toast.success("Appointment cancelled");
        fetchAppointments();
      } else {
        console.error("Failed to cancel appointment:", data.message);
        toast.error("Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Error cancelling appointment");
    }
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);
  };

  const filteredAppointments = appointments.filter((appointment) => {
    if (!selectedDate && searchUsername.trim() === "") return true;
    const isUsernameMatch = searchUsername
      ? appointment.userId.username
          .toLowerCase()
          .includes(searchUsername.toLowerCase())
      : true;
    const isDateMatch =
      !selectedDate ||
      new Date(appointment.Date).toLocaleDateString() ===
        new Date(selectedDate).toLocaleDateString();
    return isUsernameMatch && isDateMatch;
  });

  const selectedAppointment = appointments.find(
    (appointment) => appointment._id === selectedAppointmentId
  );

  const handleClearDate = () => {
    setSelectedDate(null);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-2xl mb-4">Appointments</h1>
      <div className="">
      <input
          type="date"
          onChange={handleDateChange}
          max={today}
          value={selectedDate || ""}
          className="p-2 rounded border dark:border-gray-700 dark:bg-gray-800 dark:text-white border-gray-300 bg-white text-black"
        />

{selectedDate && (
            <button onClick={handleClearDate} className="ml-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
              Clear Date
            </button>
          )}
        <div className="mt-4 ">
        <input
          type="text"
          placeholder="Search by username"
          value={searchUsername}
          className="p-2 mb-4 rounded border dark:border-gray-700 dark:bg-gray-800 dark:text-white border-gray-300 bg-white text-black"
          onChange={(e) => setSearchUsername(e.target.value)}
        />
        </div>
        
      </div>
      <Table hoverable className="w-full table-auto">
  <Table.Head>
    <Table.HeadCell>User</Table.HeadCell>
    <Table.HeadCell>Service</Table.HeadCell>
    <Table.HeadCell>Date</Table.HeadCell>
    <Table.HeadCell>Status</Table.HeadCell>
    <Table.HeadCell>Actions</Table.HeadCell>
  </Table.Head>
  <Table.Body>
    {filteredAppointments.map((appointment) => (
      <Table.Row key={appointment._id}>
        <Table.Cell>{appointment.userId.username}</Table.Cell>
        <Table.Cell>
          {appointment.serviceId
            ? appointment.serviceId.name
            : "Service Name Unavailable"}
        </Table.Cell>
        <Table.Cell>
          {appointment.Date
            ? new Date(appointment.Date).toLocaleDateString()
            : ""}
        </Table.Cell>
        <Table.Cell>
          <div
            className={`inline-flex h-6 px-2 rounded-lg w-24 justify-center items-center ${
              appointment.refunded
                ? "bg-yellow-200"
              :appointment.completed
                ? "bg-green-200"
                : appointment.cancelled
                ? "bg-red-200"
                
                : appointment.isPaid
                ? "bg-blue-200"
                : "bg-gray-200"
            } text-xs font-medium text-black`}
          >
            {appointment.refunded ? (
              <BiDollar className="h-4 w-4 text-yellow-600 mr-1" /> 
          ) : appointment.completed ? (
              <HiCheck className="h-4 w-4 text-green-600 mr-1" />
            ) : appointment.cancelled ? (
              <HiX className="h-4 w-4 text-red-600 mr-1" />
            ) : appointment.isPaid ? (
              <BsCheckCircle className="h-4 w-4 text-blue-600 mr-1" />
            ) : (
              <HiMinus className="h-4 w-4 text-gray-600 mr-1" />
            )}
            {appointment.refunded
              ? "Refunded"
            : appointment.completed
              ? "Completed"
              : appointment.cancelled
              ? "Cancelled"
              : appointment.isPaid
              ? "Paid"
              : "Pending"}
          </div>
        </Table.Cell>
        <Table.Cell className="flex flex-row">
          {!appointment.completed && !appointment.cancelled && (
            <>
              <Button
                className="mr-2 bg-blue-500 text-white hover:bg-blue-700"
                onClick={() => handleMarkCompleted(appointment._id)}
              >
                Mark Completed
              </Button>
              <Button
                className="bg-red-500 text-white hover:bg-red-700"
                onClick={() => handleCancelAppointment(appointment._id)}
              >
                Cancel
              </Button>
            </>
          )}
          {appointment.cancelled && !appointment.refunded && appointment.isPaid && (
            <Button
              onClick={() => handleIssueRefund(appointment._id)}
              className="mr-2 bg-blue-500 text-white hover:bg-blue-700"
            >
              Issue Refund
            </Button>
          )}
        </Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>


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
              {actionType === "markCompleted"
                ? "Are you sure you want to mark this appointment as completed?"
                : actionType === "cancelAppointment"
                ? "Are you sure you want to cancel this appointment?"
                : ""}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="success" onClick={handleConfirmAction}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={handleConfirmationDialogClose}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        popup
        size="lg"
        className="bg-white rounded-lg p-4 shadow-lg"
      >
        <Modal.Header className="text-xl font-semibold mb-4">
          Issue Refund
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Appointment Details</h2>
              <p>User: {selectedAppointment.userId.username}</p>
              <p>
                Service:{" "}
                {selectedAppointment.serviceId
                  ? selectedAppointment.serviceId.name
                  : "Service Name Unavailable"}
              </p>
              <p>
                Date:{" "}
                {selectedAppointment.Date
                  ? new Date(selectedAppointment.Date).toLocaleDateString()
                  : ""}
              </p>
              <p>
                Status:{" "}
                {selectedAppointment.completed
                  ? "Completed"
                  : selectedAppointment.cancelled
                  ? "Cancelled"
                  : "Pending"}
              </p>
            </div>
          )}
          <input
            type="number"
            placeholder="Enter refund amount"
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />
          <Button
            onClick={handleSubmitRefund}
            gradientDuoTone="purpleToBlue"
            className="w-full"
          >
            Submit
          </Button>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
}
