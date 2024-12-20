import express from 'express';
import {getLots, lotsController} from '../../controllers/lots.js';


const router = express.Router();
// Ruta del índice
router.post('/add', (req, res)=>lotsController(req, res));
router.get('/getAll/:id', (req, res)=>getLots(req, res));




export default router;