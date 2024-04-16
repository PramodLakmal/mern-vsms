import express from 'express';
import { issueRefund, getRefunds, generateCSVReport, generatePDFReport } from '../controllers/refund.controller.js';

const router = express.Router();

router.post('/:appointmentId/issueRefund', issueRefund);
router.get('/', getRefunds);
router.get('/csv-report', generateCSVReport);
router.get('/pdf-report', generatePDFReport);



export default router;
