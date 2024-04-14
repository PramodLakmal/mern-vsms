// employee.controller.js
import Employee from '../models/employee.model.js';
import mongoose from 'mongoose';

const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({}).sort({createdAt: -1});
        res.status(200).json(employees);
    } catch (error) {
        console.error("Error getting employees:", error);
        res.status(500).json({ error: "Failed to fetch employees" });
    }
};

const getEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({error: 'No such employee'});
        }
        
        const employee = await Employee.findById(id);
    
        if (!employee) {
            return res.status(404).json({error: 'No such employee'});
        }
    
        res.status(200).json(employee);
    } catch (error) {
        console.error("Error getting employee:", error);
        res.status(500).json({ error: "Failed to fetch employee" });
    }
};

const createEmployee = async (req, res) => {
    const {firstname, lastname, email, phone, nic, dob, gender, address, imageUrl} = req.body;

    if (!firstname || !lastname || !email || !phone || !nic || !dob || !gender || !address || !imageUrl) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const newEmployee = new Employee({
            firstname,
            lastname,
            email,
            phone,
            nic,
            dob,
            gender,
            address,
            imageUrl // Assuming your Service model has an 'imageUrl' field
        });

        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such employee'})
    }

    try {
        const employee = await Employee.findOneAndDelete({_id: id});

        if (!employee) {
            return res.status(404).json({error: 'No such employee'})
        }

        res.status(200).json(employee);
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ error: "Failed to delete employee" });
    }
};

const updateEmployee = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such employee'})
    }
    let update = { ...req.body };
    if (req.file) {
        update.image = req.file.filename;
    }

    try {
        const employee = await Employee.findOneAndUpdate({_id: id}, update, { new: true });

        if (!employee) {
            return res.status(404).json({error: 'No such employee'})
        }
        res.status(200).json(employee);
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ error: "Failed to update employee" });
    }
};

export {
    getEmployees,
    getEmployee,
    createEmployee,
    deleteEmployee,
    updateEmployee
};
