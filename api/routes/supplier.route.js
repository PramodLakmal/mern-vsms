import express from 'express';
import {
    getSuppliers,
    getSupplierById, // Renamed from getSupplier
    createSupplier,
    deleteSupplier,
    updateSupplier
} from "../controllers/supplier.controller.js";

const router = express.Router();

// GET all suppliers
router.get('/', getSuppliers);

// GET a single supplier by ID
router.get('/:id', getSupplierById); // Renamed from getSupplier

// POST a new supplier
router.post('/', createSupplier);

// DELETE a supplier
router.delete('/:id', deleteSupplier);

// UPDATE a supplier
router.patch('/:id', updateSupplier);

export default router;
