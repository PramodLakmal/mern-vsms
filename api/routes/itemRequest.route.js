import express from 'express';
import { createItemRequest, getAllItemRequests, getItemRequestById, updateItemRequestById, deleteItemRequestById } from '../controllers/itemRequest.controller.js';

const router = express.Router();

router.post('/create', createItemRequest);
router.get('/all', getAllItemRequests);
router.get('/:id', getItemRequestById);
router.put('/update/:id', updateItemRequestById);
router.delete('/:id', deleteItemRequestById);

export default router;
