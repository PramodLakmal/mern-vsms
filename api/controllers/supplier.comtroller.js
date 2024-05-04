import Supplier from '../models/supplier.model.js';
import mongoose from 'mongoose';

const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find({}).sort({ createdAt: -1 });
        res.status(200).json(suppliers);
    } catch (error) {
        console.error("Error getting suppliers:", error);
        res.status(500).json({ error: "Failed to fetch suppliers" });
    }
};

const getSupplierById = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such supplier' });
        }

        const supplier = await Supplier.findById(id);

        if (!supplier) {
            return res.status(404).json({ error: 'No such supplier' });
        }

        res.status(200).json(supplier);
    } catch (error) {
        console.error("Error getting supplier:", error);
        res.status(500).json({ error: "Failed to fetch supplier" });
    }
};



const createSupplier = async (req, res) => {
    const { firstName, lastName, email, nic, dob, gender, address, itemCode, imageUrl , itemName } = req.body;

    // Check if any required field is missing validate request item 
    if (!firstName || !lastName || !email || !nic || !dob || !gender || !address || !imageUrl|| !itemCode || !itemName) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Check if a supplier with the same email already exists
        const existingSupplier = await Supplier.findOne({ email });

        if (existingSupplier) {
            return res.status(400).json({ message: "Email is already in use." });
        }

        // If not, create a new supplier
        const newSupplier = new Supplier({
            firstName,
            lastName,
            email,
            nic,
            dob,
            gender,
            address,
            itemName,
            itemCode,
            imageUrl
        });

        await newSupplier.save();
        res.status(201).json(newSupplier);
    } catch (error) {
        console.error("Error creating supplier:", error);
        res.status(500).json({ error: "Failed to create supplier. Please try again." });
    }
};



// Other controller functions for getting, updating, and deleting suppliers can be added her

const deleteSupplier = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such supplier' });
    }

    try {
        const supplier = await Supplier.findOneAndDelete({ _id: id });

        if (!supplier) {
            return res.status(404).json({ error: 'No such supplier' });
        }

        res.status(200).json(supplier);
    } catch (error) {
        console.error("Error deleting supplier:", error);
        res.status(500).json({ error: "Failed to delete supplier" });
    }
};

const updateSupplier = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such supplier' });
    }
    let update = { ...req.body };
    if (req.file) {
        update.image = req.file.filename;
    }

    try {
        const supplier = await Supplier.findOneAndUpdate({ _id: id }, update, { new: true });

        if (!supplier) {
            return res.status(404).json({ error: 'No such supplier' });
        }
        res.status(200).json(supplier);
    } catch (error) {
        console.error("Error updating supplier:", error);
        res.status(500).json({ error: "Failed to update supplier" });
    }
};

export {
    getSuppliers,
    getSupplierById, // Renamed from getSupplier
    createSupplier,
    deleteSupplier,
    updateSupplier
};
