import Employee from '../models/employee.model.js';
import mongoose from 'mongoose'; // Make sure to import mongoose since you're using it

const getEmployees = async (req, res) => {
    const employees = await Employee.find({}).sort({createdAt: -1}); // Changed variable name to avoid conflict with the model import
  
    res.status(200).json(employees);
};
  
const getEmployee = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'No such employee'});
    }
  
    const employee = await Employee.findById(id); // Changed variable name to avoid conflict
  
    if (!employee) {
      return res.status(404).json({error: 'No such employee'});
    }
  
    res.status(200).json(employee); 
};
  
// create a new employee
const createEmployee = async (req, res) => {
    const {firstname, lastname, email, phone, nic, dob, gender, address, image} = req.body;
  
    try {
      const employee = await Employee.create({ firstname, lastname, email, phone, nic, dob, gender, address, image}); // Changed variable name to avoid conflict
      res.status(200).json(employee);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

// delete a employee
const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such employee'})
    }

    const employee = await Employee.findOneAndDelete({_id: id});

    if (!employee) {
        return res.status(400).json({error: 'No such employee'})
    }

    res.status(200).json(employee);
};
  
// update a employee
const updateEmployee = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such employee'})
    }

    const employee = await Employee.findOneAndUpdate({_id: id}, {
        ...req.body
    }, { new: true }); // Using { new: true } to return the document after update

    if (!employee) {
        return res.status(400).json({error: 'No such employee'})
    }

    res.status(200).json(employee);
};
  
// Using ES6 export syntax
export {
    getEmployees,
    getEmployee,
    createEmployee,
    deleteEmployee,
    updateEmployee
};