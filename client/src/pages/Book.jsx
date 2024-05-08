import React, { useState, useEffect } from 'react';

const BookingForm = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    vehicleNo: '',
    contactNo: '',
    date: '',
    timeSlot: '',
    service: '',
    amount: '',
  });

  const [errors, setErrors] = useState({});
  const [bookedDates, setBookedDates] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false); // New state for tracking booking success

  useEffect(() => {
    fetchBookedDates(); // Fetch already booked dates when component mounts
  }, []);

  const fetchBookedDates = async () => {
    try {
      const response = await fetch('/api/booked-dates');
      const data = await response.json();
      setBookedDates(data.bookedDates);
    } catch (error) {
      console.error('Failed to fetch booked dates:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form fields
    if (validateForm()) {
      try {
        // Send formData to the server to create a new appointment
        await fetch('/api/appointment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        // Optionally, you can reset the form after successful creation
        setFormData({
          name: '',
          vehicleNo: '',
          contactNo: '',
          date: '',
          timeSlot: '',
          service: '',
          amount: '',
        });
        // Call the onCreate callback to notify the parent component about the creation
        onCreate();
        // Set booking success state to true
        setBookingSuccess(true); // Add this line
      } catch (error) {
        console.error('Failed to create appointment:', error);
        // Optionally, handle error state here
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.vehicleNo.trim()) {
      errors.vehicleNo = 'Vehicle Number is required';
      isValid = false;
    }

    if (!formData.contactNo.trim()) {
      errors.contactNo = 'Contact Number is required';
      isValid = false;
    }

    if (!formData.date) {
      errors.date = 'Date is required';
      isValid = false;
    }

    if (!formData.timeSlot) {
      errors.timeSlot = 'Time Slot is required';
      isValid = false;
    }

    if (!formData.service) {
      errors.service = 'Service is required';
      isValid = false;
    }

    if (!formData.amount) {
      errors.amount = 'Amount is required';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const isDateBooked = (date) => {
    return bookedDates.includes(date.toISOString().split('T')[0]);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white">
      <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md container max-w-md">
        <h2 className="text-2xl font-bold text-center">Book Appointment</h2>
        {bookingSuccess && (
          <div className="bg-green-200 text-green-700 p-3 rounded-md my-4 text-center">
            Appointment booked successfully!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white" />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="vehicleNo" className="block text-sm font-medium">Vehicle Number:</label>
            <input type="text" id="vehicleNo" name="vehicleNo" value={formData.vehicleNo} onChange={handleChange} className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white" />
            {errors.vehicleNo && <p className="text-red-500">{errors.vehicleNo}</p>}
          </div>
          <div>
            <label htmlFor="contactNo" className="block text-sm font-medium">Contact Number:</label>
            <input type="text" id="contactNo" name="contactNo" value={formData.contactNo} onChange={handleChange} className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white" />
            {errors.contactNo && <p className="text-red-500">{errors.contactNo}</p>}
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium">Date:</label>
            <input type="date" id="date" name="date" value={formData.date} min={today} onChange={handleChange} className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white" />
            {errors.date && <p className="text-red-500">{errors.date}</p>}
            {formData.date && isDateBooked(new Date(formData.date)) && <p className="text-red-500">This date is already booked</p>}
          </div>
          <div>
            <label htmlFor="timeSlot" className="block text-sm font-medium">Time Slot:</label>
            <select id="timeSlot" name="timeSlot" value={formData.timeSlot} onChange={handleChange} className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
              <option value="">Select a time slot</option>
              <option value="08:00">8:00 AM</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
            </select>
            {errors.timeSlot && <p className="text-red-500">{errors.timeSlot}</p>}
          </div>
          <div>
            <label htmlFor="service" className="block text-sm font-medium">Service:</label>
            <select id="service" name="service" value={formData.service} onChange={handleChange} className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
              <option value="">Select a service</option>
              <option value="washing">Washing Packages [Rs. 2500]</option>
              <option value="lube">Lube Services [Rs. 10000]</option>
              <option value="detailing">Exterior & Interior Detailing [Rs. 2000]</option>
              <option value="tune_up">Engine Tune ups [Rs. 15000]</option>
              <option value="inspection">Inspection Reports [Rs. 7500]</option>
              <option value="waxing">Waxing [Rs. 8000]</option>
              <option value="degreasing">Undercarriage Degreasing [Rs. 45600]</option>
              <option value="windscreen">Windscreen Treatments [Rs. 24000]</option>
              <option value="battery">Battery Services [Rs. 25000]</option>
              <option value="tyre_replacement">Tyre Replacements [Rs. 30000]</option>
              <option value="spare_parts">Spare Parts Replacements [Rs. 40000]</option>
              <option value="insurance">Insurance Claims [Rs. 5000]</option>
              <option value="wheel_alignment">Wheel Alignment [Rs. 15000]</option>
              <option value="paint">Full Paints [Rs. 35000]</option>
              <option value="hybrid">Hybrid Services [Rs. 20000]</option>
              <option value="packages">Packages Treatments [Rs. 18000]</option>
            </select>
            {errors.service && <p className="text-red-500">{errors.service}</p>}
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium">Amount:</label>
            <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white" />
            {errors.amount && <p className="text-red-500">{errors.amount}</p>}
          </div>
          <div>
            <button type="submit" className="group flex items-center justify-center p-0.5 text-center font-medium relative focus:z-20 focus:outline-none text-white w-full py-1 rounded-md bg-gradient-to-r from-red-400 via-red-500 to-red-600 enabled:hover:bg-gradient-to-br focus:ring-red-300 dark:focus:ring-red-800 focus:ring-2"><span className="flex items-center transition-all duration-200 rounded-md text-sm px-5 py-2">
              Book Appointment
              </span></button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
