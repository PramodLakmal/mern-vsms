import Leave from '../models/leave.model.js';
import mongoose from 'mongoose'; // Make sure to import mongoose since you're using it

const getLeaves = async (req, res) => {
    const leaves = await Leave.find({}).sort({createdAt: -1}); // Changed variable name to avoid conflict with the model import
  
    res.status(200).json(leaves);
};
  
const getLeave = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'No such leave'});
    }
  
    const leave = await Leave.findById(id); // Changed variable name to avoid conflict
  
    if (!leave) {
      return res.status(404).json({error: 'No such leave'});
    }
  
    res.status(200).json(leave); 
};
  
// create a new leave
const createLeave = async (req, res) => {
    const {employeeid, leavetype, startdate, enddate, numofdays, reason, status} = req.body;
  
    try {
      const leave = await Leave.create({employeeid, leavetype, startdate, enddate, numofdays, reason, status}); // Changed variable name to avoid conflict
      res.status(200).json(leave);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

// delete a leave
const deleteLeave = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such leave'})
    }

    const leave = await Leave.findOneAndDelete({_id: id});

    if (!leave) {
        return res.status(400).json({error: 'No such leave'})
    }

    res.status(200).json(leave);
};
  
// update a leave
const updateLeaveStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'Invalid ID format'});
    }

    // Check if the status provided is either "Approved" or "Rejected"
    if (!['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({error: 'Invalid status. Must be either "Approved" or "Rejected".'});
    }

    try {
        const updatedLeave = await Leave.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
        // If no document found with the provided ID
        if (!updatedLeave) {
            return res.status(404).json({error: 'No such leave'});
        }
        res.status(200).json(updatedLeave);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
  
// Using ES6 export syntax
export {
    getLeaves,
    getLeave,
    createLeave,
    deleteLeave,
    updateLeaveStatus
};