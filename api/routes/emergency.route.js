import express from 'express';
// Import the controller functions
import { getEmergencies,
      getEmergency, 
      createEmergency,
      deleteEmergency, 
      updateEmergencyStatus }  from '../controllers/emergency.controller.js';


// Create a router
const router = express.Router();

// Define routes
router.get('/', getEmergencies); // Get all emergencies
router.get('/:id', getEmergency); // Get a single emergency by ID
router.post('/', createEmergency); // Create a new emergency
router.delete('/:id', deleteEmergency); // Delete an emergency
router.patch('/:id', updateEmergencyStatus); // Update the status of an emergency

// Export the router
export default router;
