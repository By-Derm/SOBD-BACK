import express from 'express';
import { newAward, getAwards } from '../../controllers/awards.controller.js';



const router = express.Router();
// Ruta del índice

router.post('/add', (req, res)=>newAward(req, res));
router.get('/getAll', (req, res)=>getAwards(req, res));




export default router;