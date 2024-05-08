import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"; // Added useDispatch
import { loadStripe } from "@stripe/stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { HiCheck, HiDownload, HiOutlineSearch } from "react-icons/hi";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import { Table } from "flowbite-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Imported the useDispatch hook from react-redux
const stripePromise = loadStripe(
  "pk_test_51P3MV5C4I6XcL6M5sWkjy5JkUmKlYgr3btOfFJneCflcFdXQkBGPkCA9HQXx8M8dqZdkzsP939cLAjuXJqym0Rrs00v2cyCmBT"
);

export default function ManageAppointments() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch(); // Initialized the dispatch function

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const paymentCancelled = queryParams.get("cancelled");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/appointment");
        if (response.ok) {
          const data = await response.json();
          setAppointments(data.appointments);
        } else {
          console.error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [currentUser]);

  useEffect(() => {
    const results = appointments.filter(appointment =>
      appointment.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  }, [searchQuery, appointments]);

  const generateAppointmentReport = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(11);
      doc.text('Appointments Report', 10, 10);

      const headerCols = ['Name', 'Vehicle No', 'Contact No', 'Date', 'Time Slot', 'Service', 'Amount(Rs)'];
      const headerRowHeight = 5;
      const headerYPos = 15;

      const tableBody = searchResults.map(appointment => ([
        appointment.name, appointment.vehicleNo, appointment.contactNo, formatDate(appointment.date), appointment.timeSlot, appointment.service, appointment.amount
      ]));
      doc.autoTable({
        head: [headerCols],
        body: tableBody,
        startY: headerYPos + headerRowHeight,
        styles: { overflow: 'linebreak' },
        columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 25 }, 2: { cellWidth: 25 }, 3: { cellWidth: 25 }, 4: { cellWidth: 20 }, 5: { cellWidth: 28 }, 6: { cellWidth: 28 } },
        margin: { top: headerYPos + headerRowHeight + 5 }
      });

      const endY = headerYPos + doc.previousAutoTable.finalY;

      const additionalInfoYPos = endY + 5;
      doc.text('Report generated on:', 8, additionalInfoYPos);
      doc.text(new Date().toLocaleDateString(), 50, additionalInfoYPos);

      doc.save('appointments_report.pdf');
    } catch (error) {
      console.error('Error generating appointments report:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePay = async (appointment) => {
    const stripe = await stripePromise;
    const response = await fetch("/api/create-payment-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointment,
      }),
    });

    const session = await response.json();
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    } else {
      // Dispatch an action to update the appointment status to paid
      dispatch({ type: 'UPDATE_APPOINTMENT', payload: { id: appointment._id, isPaid: true } });
      toast.success("Payment successful.");
    }
  };

  const handleDelete = async (appointmentId) => {
    try {
      const response = await fetch(`/api/appointment/${appointmentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        // Update local state to remove the deleted appointment
        setAppointments(appointments.filter((appointment) => appointment._id !== appointmentId));
        toast.success("Appointment deleted successfully.");
      } else {
        // Handle unsuccessful deletion
        console.error("Failed to delete appointment:", response.statusText);
        toast.error("Failed to delete appointment.");
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Failed to delete appointment:", error);
      toast.error("Failed to delete appointment.");
    }
  };
  

  const showToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    if (paymentCancelled) {
      showToast("Payment was cancelled.");
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("cancelled");
      navigate(newUrl.pathname + newUrl.search);
    }
  }, [paymentCancelled, navigate]);

  return (
    <div className="container mx-auto p-4 relative">
      <h2 className="text-2xl font-semibold mb-4">Manage Appointments</h2>
      <ToastContainer />
      <div className='flex justify-between mb-4'>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by vehicle number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 pl-10 rounded  text-gray-600"
          />
          <HiOutlineSearch className="absolute top-3 left-4 text-gray-600" />
        </div>
        <button
          type="button"
          className="bg-green-500 text-white hover:bg-green-700 px-4 py-2 rounded-md flex items-center"
          onClick={generateAppointmentReport}
        >
          <HiDownload className="mr-2" /> Generate Report
        </button>
      </div>
      {!loading && (
        <div className="overflow-x-auto">
          <Table className="w-full">
            <thead>
              <tr className="text-left text-gray-600 dark:text-gray-400">
                <th>Name</th>
                <th>Vehicle No</th>
                <th>Contact No</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Service</th>
                <th>Amount(Rs)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((appointment) => (
                <tr
                  key={appointment._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td>{appointment.name}</td>
                  <td>{appointment.vehicleNo}</td>
                  <td>{appointment.contactNo}</td>
                  <td>{formatDate(appointment.date)}</td>
                  <td>{appointment.timeSlot}</td>
                  <td>{appointment.service}</td>
                  <td>{appointment.amount}</td>
                  <td className="flex gap-2">
                    {appointment.isPaid ? (
                      <span className="inline-flex items-center py-1 px-2 rounded-md bg-green-200 text-green-700">
                        <HiCheck className="h-4 w-4 mr-1" /> Payment Successful
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handlePay(appointment)}
                          className="bg-blue-500 text-white hover:bg-blue-700 px-3 py-1 rounded-md"
                        >
                          Pay
                        </button>
                        <button
                          onClick={() => handleUpdate(appointment._id)} // Assuming this is your update function
                          className="bg-green-500 text-white hover:bg-green-700 px-3 py-1 rounded-md flex items-center"
                        >
                          <HiPencilAlt className="mr-1" /> Update
                        </button>
                        <button
                          onClick={() => handleDelete(appointment._id)}
                          className="bg-red-500 text-white hover:bg-red-700 px-3 py-1 rounded-md flex items-center"
                        >
                          <HiTrash className="mr-1" /> Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
