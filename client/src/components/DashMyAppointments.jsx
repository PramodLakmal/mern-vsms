import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { HiCheck, HiX } from "react-icons/hi";
import { Table } from "flowbite-react";

const stripePromise = loadStripe(
  "pk_test_51P3MV5C4I6XcL6M5sWkjy5JkUmKlYgr3btOfFJneCflcFdXQkBGPkCA9HQXx8M8dqZdkzsP939cLAjuXJqym0Rrs00v2cyCmBT"
);

export default function MyAppointments() {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  const location = useLocation(); // Use useLocation hook to access current URL
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const paymentCancelled = queryParams.get("cancelled");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `/api/appointment/user/${currentUser._id}`
        );
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
    // Call your backend to create a payment session
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
    // Redirect to Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
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
      // Remove the 'cancelled' query parameter from the URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("cancelled");
      navigate(newUrl.pathname + newUrl.search); // Update the URL without the 'cancelled' query parameter
    }
  }, [paymentCancelled, navigate]);

  return (
    <div className="container mx-auto p-4 relative">
      <h2 className="text-2xl font-semibold mb-4">My Appointments</h2>
      <ToastContainer />
      {!loading && (
        <Table className="w-full table-auto">
          <thead>
            <tr className="text-left text-gray-600 dark:text-gray-400">
              <th>Vehicle No</th>
              <th>Contact No</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Service</th>
              <th>Amount to Pay</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr
                key={appointment._id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td>{appointment.VehicleNo}</td>
                <td>{appointment.ContactNo}</td>
                <td>{formatDate(appointment.Date)}</td>
                <td>{appointment.TimeSlot}</td>
                <td>{appointment.serviceId.name}</td>
                <td>
                  {appointment.isPaid ? (
                    <span className="text-gray-600">${appointment.amount}</span>
                  ) : (
                    <span className="text-gray-600">
                      ${appointment.serviceId.price}
                    </span>
                  )}
                </td>
                <td>
                  <div className="flex flex-row">
                    {appointment.isPaid ? (
                      <span className="mr-2 inline-flex items-center py-1 px-2 rounded-md bg-green-200 text-green-700">
                        <HiCheck className="h-4 w-4 mr-1" /> Payment Successful
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePay(appointment)}
                        className="mr-2 bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 rounded-md"
                      >
                        Pay
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
