import Service from '../models/service.model.js';
import mongoose from 'mongoose';

const getServices = async (req, res) => {
    try {
        const services = await Service.find({}).sort({ createdAt: -1 });
        res.status(200).json(services);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getService = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such service' });
    }

    const service = await Service.findById(id);

    if (!service) {
        return res.status(404).json({ error: 'No such service' });
    }

    res.status(200).json(service);
};

const createService = async (req, res) => {
    const { name, type, vehiclename, price, imageUrl } = req.body;

    if (!name || !type || !vehiclename || !price || !imageUrl) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const newService = new Service({
            name,
            type,
            vehiclename,
            price,
            imageUrl // Assuming your Service model has an 'imageUrl' field
        });

        await newService.save();
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteService = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such service' });
    }

    const service = await Service.findOneAndDelete({ _id: id });

    if (!service) {
        return res.status(400).json({ error: 'No such service' });
    }

    res.status(200).json(service);
};

const updateService = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No such service' });
    }

    let update = { ...req.body };

    try {
        const service = await Service.findOneAndUpdate({ _id: id }, update, { new: true });

        if (!service) {
            return res.status(404).json({ error: 'No such service' });
        }

        res.status(200).json(service);
    } catch (error) {
        console.error("Error updating service:", error);
        res.status(500).json({ error: "Failed to update service" });
    }
};

export {
    getServices,
    getService,
    createService,
    deleteService,
    updateService
};
