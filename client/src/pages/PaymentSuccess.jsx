import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  useEffect(() => {
    // Extract appointment details from query parameters
    const searchParams = new URLSearchParams(location.search);
    const vehicleNo = searchParams.get("vehicleNo");
    const contactNo = searchParams.get("contactNo");
    const date = searchParams.get("date");
    const timeSlot = searchParams.get("timeSlot");
    const serviceName = searchParams.get("serviceName");
    const amountPaid = searchParams.get("amountPaid");

    // Set appointment details in state
    setAppointmentDetails({
      vehicleNo,
      contactNo,
      date,
      timeSlot,
      serviceName,
      amountPaid,
    });
  }, [location.search]);

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Payment Successful</h2>
      {appointmentDetails && (
        <div>
          <p>
            <strong>Vehicle No:</strong> {appointmentDetails.vehicleNo}
          </p>
          <p>
            <strong>Contact No:</strong> {appointmentDetails.contactNo}
          </p>
          <p>
            <strong>Date:</strong> {appointmentDetails.date}
          </p>
          <p>
            <strong>Time Slot:</strong> {appointmentDetails.timeSlot}
          </p>
          <p>
            <strong>Service:</strong> {appointmentDetails.serviceName}
          </p>
          <p>
            <strong>Amount Paid:</strong> ${appointmentDetails.amountPaid}
          </p>
          {/* You can add more details here */}
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
