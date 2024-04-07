import express from 'express';
import {
    getAppointments,
    getAppointment,
    createAppointment,
    deleteAppointment,
    updateAppointment
} from "../controllers/appointment.controller.js"; // Import the appropriate controller functions

const router = express.Router();

// GET all appointments
router.get('/', getAppointments);

// GET a single appointment
router.get('/:id', getAppointment);

// POST a new appointment
router.post('/', createAppointment);

// DELETE an appointment
router.delete('/:id', deleteAppointment);

// UPDATE an appointment
router.patch('/:id', updateAppointment);

export default router;
