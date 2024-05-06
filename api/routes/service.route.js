import express from 'express';

import {
    getServices,
    getService,
    createService,
    deleteService,
    updateService,
    getAllServices
} from "../controllers/service.controller.js" ;


 const router = express.Router()


// GET all service
router.get('/', getServices)

router.get('/all', getAllServices)

// GET a single service
router.get('/:id', getService)

// POST a new service 
router.post('/', createService)

// DELETE a service 
router.delete('/:id', deleteService)

// UPDATE a service 
router.patch('/:id',updateService);

export default router;
 
