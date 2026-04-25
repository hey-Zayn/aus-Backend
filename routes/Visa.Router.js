const express = require('express');
const router = express.Router();
const visaController = require('../controller/Visa.Controller');
const protectRoute = require('../Middleware/authMiddleware');

// Public route for VEVO check
router.post('/verify', visaController.verifyVisa);

// All following routes are protected by auth middleware
router.use(protectRoute);

// Create a new visa
router.post('/', visaController.createVisa);

// Get all visas for authenticated user
router.get('/all', visaController.getAllVisas);

// Get single visa details
router.get('/:id', visaController.getVisaById);

// Update visa details
router.put('/:id', visaController.updateVisa);

// Delete visa record
router.delete('/:id', visaController.deleteVisa);

// Send document email
router.post('/:id/send-email', visaController.sendVisaEmail);

module.exports = router;
