import React, { useState } from 'react';

function ServiceBooking() {
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    vehicleNo: '',
    contactNo: '',
    date: '',
    timeSlot: '',
    service: ''
  });

  function submitForm(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const vehicleNo = document.getElementById('vehicleNo').value;
    const contactNo = document.getElementById('contactNo').value;
    const date = document.getElementById('date').value;
    const timeSlot = document.getElementById('timeSlot').value;
    const service = document.getElementById('service').value;

    setBookingDetails({
      name,
      vehicleNo,
      contactNo,
      date,
      timeSlot,
      service
    });

    document.getElementById('successMessage').textContent = 'Booking Successful!';
    document.getElementById('bookingDetails').classList.remove('hidden');
    document.getElementById('downloadTicketBtn').classList.remove('hidden');
    document.getElementById('downloadTicketBtn').onclick = downloadTicket;
  }

  function downloadTicket() {
    const { name, vehicleNo, contactNo, date, timeSlot, service } = bookingDetails;
    const ticketContent = `Name: ${name}\nVehicle No: ${vehicleNo}\nContact No: ${contactNo}\nDate: ${date}\nTime Slot: ${timeSlot}\nService: ${service}`;
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'ticket.txt';
    link.click();
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white">
      <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md container max-w-md">
        <h2 className="text-2xl font-bold text-center">SERVICE BOOKING FORM</h2>
        <p className="text-s font-regular mb-4 text-center">Fill out this form to reserve your appointment</p>
        <form onSubmit={submitForm} className="space-y-4" id="bookingForm">
          <div>
            <label htmlFor="name" className="block text-sm font-medium form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full border rounded-md p-2 form-input focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              placeholder="Enter name"
              required />
          </div>
          <div>
            <label htmlFor="vehicleNo" className="block text-sm font-medium form-label">Vehicle No</label>
            <input
              type="text"
              id="vehicleNo"
              name="vehicleNo"
              className="w-full border rounded-md p-2 form-input focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              placeholder="Enter vehicle number"
              required />
          </div>
          <div>
            <label htmlFor="contactNo" className="block text-sm font-medium form-label">Contact No</label>
            <input
              type="text"
              id="contactNo"
              name="contactNo"
              className="w-full border rounded-md p-2 form-input focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              placeholder="Enter contact number"
              required />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium form-label">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              className="w-full border rounded-md p-2 form-input focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              required />
          </div>
          <div>
            <label htmlFor="timeSlot" className="block text-sm font-medium form-label">Time Slot</label>
            <select
              id="timeSlot"
              name="timeSlot"
              className="w-full border rounded-md p-2 form-select focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              required>
              <option value="" disabled selected>Select Time Slot</option>
              <option value="9:00 AM">9:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="1:00 PM">1:00 PM</option>
              <option value="2:00 PM">2:00 PM</option>
              <option value="3:00 PM">3:00 PM</option>
              <option value="4:00 PM">4:00 PM</option>
              <option value="5:00 PM">5:00 PM</option>
            
            </select>
          </div>
          <div>
            <label htmlFor="service" className="block text-sm font-medium form-label">Service</label>
            <select
              id="service"
              name="service"
              className="w-full border rounded-md p-2 form-select focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              required>
              <option value="" disabled selected>Select Service</option>
              <option value="washingPackages">Washing Packages</option>
              <option value="lubeServices">Lube Services</option>
              <option value="exteriorInteriorDetailing">Exterior & Interior Detailing</option>
              <option value="engineTuneUps">Engine Tune ups</option>
              <option value="inspectionReports">Inspection Reports</option>
              <option value="waxing">Waxing</option>
              <option value="undercarriageDegreasing">Undercarriage Degreasing</option>
              <option value="windscreenTreatments">Windscreen Treatments</option>
              <option value="batteryServices">Battery Services</option>
              <option value="tyreReplacements">Tyre Replacements</option>
              <option value="sparePartsReplacements">Spare Parts Replacements</option>
              <option value="hybridServices">Hybrid Services</option>
              <option value="insuranceClaims">Insurance Claims</option>
              <option value="wheelAlignment">Wheel Alignment</option>
              <option value="fullPaints">Full Paints</option>
              <option value="partReplacements">Part Replacements</option>
            
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-500 transition-colors form-button">
              Book Now
            </button>
          </div>
        </form>
        <div id="bookingDetails" className="hidden mt-4 booking-details">
          <h3 className="text-xl font-semibold">Booking Details:</h3>
          <p>Name: {bookingDetails.name}</p>
          <p>Vehicle No: {bookingDetails.vehicleNo}</p>
          <p>Contact No: {bookingDetails.contactNo}</p>
          <p>Date: {bookingDetails.date}</p>
          <p>Time Slot: {bookingDetails.timeSlot}</p>
          <p>Service: {bookingDetails.service}</p>
          <p className="text-green-500 font-semibold" id="successMessage"></p>
          <button
            id="downloadTicketBtn"
            className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2 hidden">
        
            Download Summary
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceBooking;
