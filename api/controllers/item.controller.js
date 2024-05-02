import Item from '../models/item.model.js';
import { errorHandler } from '../utils/error.js';

// Controller function to get a single item by ID
export const getItem = async (req, res, next) => {
    try {
      const item = await Item.findById(req.params.itemId);
      if (!item) {
        errorHandler(404, 'Item not found', next);
        return;
      }
      res.status(200).json(item);
    } catch (error) {
      next(error); // Pass the error to the next middleware
    }
  };
  
  // Controller function to get all items
  export const getItems = async (req, res, next) => {
    try {
      const items = await Item.find();
      res.status(200).json({items});
    } catch (error) {
      next(error); // Pass the error to the next middleware
    }
  };