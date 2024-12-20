import express from 'express';
import { getAll } from '../../controllers/transfers.controller.js';


const router = express.Router();
// Ruta del índice
router.get('/getAll/:month', (req, res)=>getAll(req, res));





export default router;