import Service from '../models/service.model.js';
import mongoose from 'mongoose'; // Make sure to import mongoose since you're using it

const getServices = async (req, res) => {
    const services = await Service.find({}).sort({createdAt: -1}); // Changed variable name to avoid conflict with the model import
  
    res.status(200).json(services);
};
  
const getService = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'No such service'});
    }
  
    const service = await Service.findById(id); // Changed variable name to avoid conflict
  
    if (!service) {
      return res.status(404).json({error: 'No such service'});
    }
  
    res.status(200).json(service); 
};
  
// create a new service
const createService = async (req, res) => {
    const {name, type, vehiclename, price, image} = req.body;
  
    try {
      const service = await Service.create({ name, type, vehiclename, price, image}); // Changed variable name to avoid conflict
      res.status(200).json(service);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

// delete a service
const deleteService = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such service'})
    }

    const service = await Service.findOneAndDelete({_id: id});

    if (!service) {
        return res.status(400).json({error: 'No such service'})
    }

    res.status(200).json(service);
};

// update a service
const updateService = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such service'})
    }

    const service = await Service.findOneAndUpdate({_id: id}, {
        ...req.body
    }, { new: true }); // Using { new: true } to return the document after update

    if (!service) {
        return res.status(400).json({error: 'No such service'})
    }

    res.status(200).json(service);
};

// Using ES6 export syntax
export {
    getServices,
    getService,
    createService,
    deleteService,
    updateService
};
