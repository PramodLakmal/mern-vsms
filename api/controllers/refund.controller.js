import Refund from '../models/refund.model.js';
import Appointment from '../models/appointment.model.js';
import json2csv from 'json2csv';
import fs from 'fs';
import pdf from 'html-pdf';
import ejs from 'ejs';


export const issueRefund = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { refundedAmount } = req.body;

    // Create refund entry
    const refund = new Refund({
      appointmentId: appointmentId,
      refundedAmount: refundedAmount
    });
    await refund.save();

    // Update appointment document in the database
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { refunded: true },
      { new: true }
    );

    res.status(200).json({ message: 'Refund issued successfully', refund: updatedAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to issue refund', error: error.message });
  }
};

export const getRefunds = async (req, res) => {
  try {
    const refunds = await Refund.find().populate({
      path: 'appointmentId',
      populate: {
        path: 'userId serviceId',
        select: 'username name',
      },
    });

    res.status(200).json({ refunds });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get refunds', error: error.message });
  }
};

// Endpoint for generating CSV report
export const generateCSVReport = async (req, res) => {
  try {
    const refunds = await Refund.find().populate({
      path: 'appointmentId',
      populate: {
        path: 'userId serviceId',
        select: 'username name',
      },
    });

    if (!refunds || refunds.length === 0) {
      return res.status(404).json({ message: 'No refunds found' });
    }

    // Define CSV fields
    const fields = [
      { label: 'User Name', value: 'appointmentId.userId.username' },
      { label: 'Service Name', value: 'appointmentId.serviceId.name' },
      { label: 'Refund Amount', value: 'refundedAmount' },
      { label: 'Refund Date', value: 'dateIssued' },
    ];

    // Format refunds data into CSV format using json2csv
    const csvData = json2csv.parse(refunds, { fields, withBOM: true });

    // Write CSV data to a file
    fs.writeFileSync('refunds_report.csv', csvData);

    // Send the file as a response
    res.download('refunds_report.csv');
  } catch (error) {
    console.error('Error generating CSV report:', error);
    res.status(500).json({ message: 'Failed to generate CSV report' });
  }
};
// Endpoint for generating PDF report
export const generatePDFReport = async (req, res) => {
  try {
    const refunds = await Refund.find().populate({
      path: 'appointmentId',
      populate: {
        path: 'userId serviceId',
        select: 'username name',
      },
    });

    // Render PDF template using EJS
    const template = fs.readFileSync('report_template.ejs', 'utf-8');
    const html = ejs.render(template, { refunds });

    // Generate PDF
    pdf.create(html).toFile('refunds_report.pdf', (err, result) => {
      if (err) throw err;
      res.download('refunds_report.pdf');
    });
  } catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).json({ message: 'Failed to generate PDF report' });
  }
};