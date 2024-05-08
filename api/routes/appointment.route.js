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

//GET all appointments
router.get('/',getAppointments)

router.get('/cashier', getAppointmentsCashier);

router.put('/cashier/:appointmentId/markCompleted', markAppointmentCompleted)
router.put('/cashier/:appointmentId/cancel', cancelAppointment);

// GET Single appointment
router.get('/:id', getAppointment);

// Post a new appointment
router.post('/', createAppointment);

//DELETE an appointment
router.delete('/:id', deleteAppointment);

//UPDATE an appointment
router.patch('/:id', updateAppointment);


// Additional routes
router.get('/user/:userId', getAppointmentsByUser);
router.get('/cashier', getAppointmentsCashier);
router.put('/complete/:appointmentId', markAppointmentCompleted);
router.put('/cancel/:appointmentId', cancelAppointment);

export default router;
