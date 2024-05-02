import Emergency from '../models/emergency.model.js';
import mongoose from 'mongoose';
import { jsPDF } from 'jspdf'; // Import jsPDF for report generation

const getEmergencies = async (req, res) => {
    try {
        const emergencies = await Emergency.find({}).sort({createdAt: -1});
        res.status(200).json(emergencies);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// Get a single emergency by ID
const getEmergency = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such emergency' });
    }

    try {
        const emergency = await Emergency.findById(id);

        if (!emergency) {
            return res.status(404).json({ error: 'No such emergency' });
        }

        res.status(200).json(emergency);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
    
 const createEmergency = async (req, res) => {
    const { servicetype, othertype, cusname, phone, date, area, status, images } = req.body;

    try {
        const newEmergency = new Emergency({
            servicetype,
            othertype,
            cusname,
            phone,
            date,
            area,
            status,
            images  // This directly assigns the array from the request to the model
        });

        const savedEmergency = await newEmergency.save();
        res.status(201).json(savedEmergency);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const deleteEmergency = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such emergency' });
    }

    try {
        const emergency = await Emergency.findByIdAndDelete(id);

        if (!emergency) {
            return res.status(404).json({ error: 'No such emergency' });
        }

        res.status(200).json(emergency);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const updateEmergencyStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid ID format'});
    }

    // Check if the status provided is either "Yes" or "No"
    if (!['pending','accept', 'reject'].includes(status)) {
        return res.status(400).json({error: 'Invalid status. Must be either "Yes" or "No".'});
    }

    try {
        const updatedEmergency = await Emergency.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
        // If no document found with the provided ID
        if (!updatedEmergency) {
            return res.status(404).json({error: 'No such emergency'});
        }
        res.status(200).json(updatedEmergency);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const generateEmergencyReport = async (req, res) => {
    try {
        const emergencies = await Emergency.find();
        const doc = new jsPDF();
        // Generate report logic here
        res.status(200).json({ message: 'Emergency service report generated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    getEmergencies,
    getEmergency,
    createEmergency,
    deleteEmergency,
    updateEmergencyStatus,
    generateEmergencyReport
};