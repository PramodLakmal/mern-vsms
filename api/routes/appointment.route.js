import express from 'express';
import {
  getAppointments,
  getAppointment,
  createAppointment,
  deleteAppointment,
  updateAppointment,
  getAppointmentsByUser,
  getAppointmentsCashier,
  markAppointmentCompleted,
  cancelAppointment
} from '../controllers/appointment.controller.js';

const router = express.Router();

// Public routes
router.get('/', getAppointments);
router.get('/:id', getAppointment);

// Private routes (require authentication)
router.post('/', createAppointment);
router.delete('/:id', deleteAppointment);
router.put('/:id', updateAppointment);

// Additional routes
router.get('/user/:userId', getAppointmentsByUser);
router.get('/cashier', getAppointmentsCashier);
router.put('/complete/:appointmentId', markAppointmentCompleted);
router.put('/cancel/:appointmentId', cancelAppointment);

export default router;
