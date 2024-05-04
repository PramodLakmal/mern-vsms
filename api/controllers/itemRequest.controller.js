
import ItemRequest from '../models/itemRequest.model.js';

// Create a new item request
export const createItemRequest = async (req, res, next) => {
  try {
    const itemRequestData = req.body;
    const itemRequest = new ItemRequest(itemRequestData);
    await itemRequest.save();
    res.status(201).json({ message: 'Item request created successfully', itemRequest });
  } catch (error) {
    next(error);
  }
};

// Get all item requests
export const getAllItemRequests = async (req, res, next) => {
  try {
    const itemRequests = await ItemRequest.find();
    res.status(200).json({ itemRequests });
  } catch (error) {
    next(error);
  }
};

// Get a single item request by ID
export const getItemRequestById = async (req, res, next) => {
  try {
    const itemRequestId = req.params.id;
    const itemRequest = await ItemRequest.findById(itemRequestId);
    if (!itemRequest) {
      return res.status(404).json({ message: 'Item request not found' });
    }
    res.status(200).json(itemRequest);
  } catch (error) {
    next(error);
  }
};

// Update an item request by ID
export const updateItemRequestById = async (req, res, next) => {
  try {
    const itemRequestId = req.params.id;
    const updatedItemRequestData = req.body;
    const updatedItemRequest = await ItemRequest.findByIdAndUpdate(itemRequestId, updatedItemRequestData, { new: true });
    if (!updatedItemRequest) {
      return res.status(404).json({ message: 'Item request not found' });
    }
    res.status(200).json({ message: 'Item request updated successfully', updatedItemRequest });
  } catch (error) {
    next(error);
  }
};

// Delete an item request by ID
export const deleteItemRequestById = async (req, res, next) => {
  try {
    const itemRequestId = req.params.id;
    const deletedItemRequest = await ItemRequest.findByIdAndDelete(itemRequestId);
    if (!deletedItemRequest) {
      return res.status(404).json({ message: 'Item request not found' });
    }
    res.status(200).json({ message: 'Item request deleted successfully', deletedItemRequest });
  } catch (error) {
    next(error);
  }
};
