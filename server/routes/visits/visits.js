import express from 'express';
import { getAll } from '../../controllers/visits.controller.js';


const router = express.Router();
// Ruta del índice
router.get('/getAll', (req, res)=>getAll(req, res));





export default router;