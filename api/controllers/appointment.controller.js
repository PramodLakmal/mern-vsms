import Appointment from '../models/appointment.model.js'; // Import the appointment model
import mongoose from 'mongoose';

const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({}).sort({ date: 1, timeSlot: 1 });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAppointment = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid appointment ID' });
    }

    try {
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createAppointment = async (req, res) => {
    const { name, vehicleNo, contactNo, date, timeSlot, service } = req.body;

    try {
        const appointment = await Appointment.create({ name, vehicleNo, contactNo, date, timeSlot, service });
        res.status(201).json(appointment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteAppointment = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid appointment ID' });
    }

    try {
        const appointment = await Appointment.findOneAndDelete({ _id: id });
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateAppointment = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid appointment ID' });
    }

    try {
        const appointment = await Appointment.findByIdAndUpdate(id, req.body, { new: true });
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    getAppointments,
    getAppointment,
    createAppointment,
    deleteAppointment,
    updateAppointment
};

export const getAppointmentsByUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const appointments = await Appointment.find({ userId }).populate('serviceId').exec();
      res.status(200).json({ appointments });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
    }
  };

  export const getAppointmentsCashier = async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('userId').populate('serviceId');
        res.status(200).json({ appointments });
      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
      }
    };
  
    export const markAppointmentCompleted = async (req, res) => {
        try {
          const { appointmentId } = req.params;
          const appointment = await Appointment.findByIdAndUpdate(appointmentId, { completed: true });
          res.status(200).json({ message: 'Appointment marked as completed', appointment });
        } catch (error) {
          res.status(500).json({ message: 'Failed to mark appointment as completed', error: error.message });
        }
      };
      
      export const cancelAppointment = async (req, res) => {
          try {
            const { appointmentId } = req.params;
            const appointment = await Appointment.findById(appointmentId);
            if (!appointment) {
              return res.status(404).json({ message: 'Appointment not found' });
            }
            appointment.cancelled = true;
            await appointment.save();
            res.status(200).json({ message: 'Appointment cancelled', appointment });
          } catch (error) {
            res.status(500).json({ message: 'Failed to cancel appointment', error: error.message });
          }
        };