// employee.routes.js
import express from 'express';
import {
  getEmployees,
  getEmployee,
  createEmployee,
  deleteEmployee,
  updateEmployee
} from "../controllers/employee.controller.js";

const router = express.Router();

router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.post('/', createEmployee);
router.delete('/:id', deleteEmployee)
router.patch('/:id', updateEmployee);

export default router;
