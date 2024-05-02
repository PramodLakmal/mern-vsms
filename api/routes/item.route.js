import express from 'express';
import { getItem, getItems } from '../controllers/item.controller.js';

const router = express.Router();

// Route to get a single item
router.get('/:itemId', getItem);

// Route to get all items
router.get('/', getItems);

export default router;
