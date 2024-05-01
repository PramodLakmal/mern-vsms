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
          <Table.Head>
              <Table.HeadCell>Vehicle No</Table.HeadCell>
              <Table.HeadCell>Contact No</Table.HeadCell>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Time Slot</Table.HeadCell>
              <Table.HeadCell>Service</Table.HeadCell>
              <Table.HeadCell>Amount to Pay</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {appointments.map((appointment) => (
              <Table.Row
                key={appointment._id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Table.Cell>{appointment.vehicleNo}</Table.Cell>
                <Table.Cell>{appointment.contactNo}</Table.Cell>
                <Table.Cell>{formatDate(appointment.date)}</Table.Cell>
                <Table.Cell>{appointment.timeSlot}</Table.Cell>
                <Table.Cell>{appointment.serviceId.name}</Table.Cell>
                <Table.Cell>
                  {appointment.isPaid ? (
                    <span className="text-gray-600">LKR {appointment.amount}</span>
                  ) : (
                    <span className="text-gray-600">
                      LKR {appointment.serviceId.price}
                    </span>
                  )}
                </Table.Cell>
                <Table.Cell>
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
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
}
