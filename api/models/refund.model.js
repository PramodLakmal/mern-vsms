// refund model

import mongoose from 'mongoose';

const refundSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  refundedAmount: { type: Number, required: true },
  dateIssued: { type: Date, default: Date.now },
});

const Refund = mongoose.model('Refund', refundSchema);

export default Refund;