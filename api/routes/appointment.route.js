import express from "express";
import {
  getAppointments,
  getAppointment,
  createAppointment,
  deleteAppointment,
  updateAppointment,
  getAppointmentsByUser,
  getAppointmentsCashier,
  markAppointmentCompleted,
  cancelAppointment,
} from "../controllers/appointment.controller.js"; // Import the appropriate controller functions

const router = express.Router();

// GET all appointments
router.get("/", getAppointments);

router.get("/cashier", getAppointmentsCashier);

router.put('/cashier/:appointmentId/markCompleted', markAppointmentCompleted);
router.put('/cashier/:appointmentId/cancel', cancelAppointment);

// GET a single appointment
router.get("/:id", getAppointment);

// POST a new appointment
router.post("/", createAppointment);

// DELETE an appointment
router.delete("/:id", deleteAppointment);

// UPDATE an appointment
router.patch("/:id", updateAppointment);

router.get("/user/:userId", getAppointmentsByUser);

export default router;
