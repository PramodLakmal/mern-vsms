import Salary from '../models/salary.model.js';
import mongoose from 'mongoose'; // Make sure to import mongoose since you're using it

const getSalaries = async (req, res) => {
    const salaries = await Salary.find({}).sort({createdAt: -1}); // Changed variable name to avoid conflict with the model import
  
    res.status(200).json(salaries);
};
  
const getSalary = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'No such salary'});
    }
  
    const salary = await Salary.findById(id); // Changed variable name to avoid conflict
  
    if (!salary) {
      return res.status(404).json({error: 'No such salary'});
    }
  
    res.status(200).json(salary); 
};
  
// create a new salary
const createSalary = async (req, res) => {
    const {employeeid, month, year, basicsalary, othours, otrate, ottotal, bonus, reduction, netsalary} = req.body;
  
    try {
      const salary = await Salary.create({employeeid, month, year, basicsalary, othours, otrate, ottotal, bonus, reduction, netsalary}); // Changed variable name to avoid conflict
      res.status(200).json(salary);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

// delete a salary
const deleteSalary = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such salary'})
    }

    const salary = await Salary.findOneAndDelete({_id: id});

    if (!salary) {
        return res.status(400).json({error: 'No such salary'})
    }

    res.status(200).json(salary);
};
  
// update a salary
const updateSalary = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No such salary'})
    }

    const salary = await Salary.findOneAndUpdate({_id: id}, {
        ...req.body
    }, { new: true }); // Using { new: true } to return the document after update

    if (!salary) {
        return res.status(400).json({error: 'No such salary'})
    }

    res.status(200).json(salary);
};
  
// Using ES6 export syntax
export {
    getSalaries,
    getSalary,
    createSalary,
    deleteSalary,
    updateSalary
};